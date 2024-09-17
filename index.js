const speech = require('@google-cloud/speech');
const handleRecognition = require('./controller/HandleRecognition');
const { program } = require('commander');
const {
    Porcupine,
    BuiltinKeyword
} = require('@picovoice/porcupine-node');
const { PvRecorder } = require('@picovoice/pvrecorder-node');
const { exec } = require('child_process');

const client = new speech.SpeechClient();

program.parse(process.argv);

let isInterrupted = false;

async function micDemo() {
    let accessKey = '...'
    let keywordPaths = '/home/pi/johny/reco/assets/hej.ppn';
    let libraryFilePath = program['library_file_path'];
    let modelFilePath = '/home/pi/johny/reco/assets/pl.pv';
    let sensitivity = 0.65;
    let audioDeviceIndex = program["audio_device_index"];

    if (!Array.isArray(keywordPaths)) {
        keywordPaths = keywordPaths.split(',');
    }

    let keywordNames = keywordPaths.map((keywordPath) => {
        return keywordPath.split(/[\\|\/]/).pop().split('_')[0];
    });

    let sensitivities = new Array(keywordPaths.length).fill(sensitivity);

    let porcupine = new Porcupine(
        accessKey,
        keywordPaths,
        sensitivities,
        modelFilePath,
        libraryFilePath
    );

    const frameLength = porcupine.frameLength;
    const sampleRate = porcupine.sampleRate;

    const recorder = new PvRecorder(frameLength, audioDeviceIndex);
    recorder.start();

    console.log(`Using device: ${recorder.getSelectedDevice()}...`);
    console.log(`Listening for wake word(s): ${keywordNames}`);
    console.log('Press Ctrl+C to exit.');

    while (!isInterrupted) {
        const pcm = await recorder.read();
        let index = porcupine.process(pcm);
        if (index !== -1) {
            try {
                // Play activation sound
                exec('aplay ~/johny/active.wav', (error) => {
                    if (error) {
                        console.error(`Activation sound error: ${error}`);
                    }
                });

                console.log('Wake word detected, starting streaming recognition...');

                // Start streaming recognition
                await startStreamingRecognition(recorder, sampleRate);

            } catch (e) {
                console.error('Error during streaming recognition:', e);
            }
        }
    }

    console.log('Stopping...');
    recorder.release();
    porcupine.release();
}

async function startStreamingRecognition(recorder, sampleRate) {
    return new Promise((resolve, reject) => {
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: sampleRate,
            languageCode: 'pl-PL',
            interimResults: false,
        };

        const request = {
            config,
        };

        const recognizeStream = client
            .streamingRecognize(request)
            .on('error', (error) => {
                console.error('Streaming recognition error:', error);
                recorder.stop();
                resolve();
            })
            .on('data', async (data) => {
                if (data.results[0] && data.results[0].alternatives[0]) {
                    const transcription = data.results[0].alternatives[0].transcript;
                    console.log(`Transcription: ${transcription}`);

                    if (data.results[0].isFinal) {
                        // Handle the transcription result
                        await handleRecognition(data);

                        // Stop the recognition stream
                        recognizeStream.destroy();
                        resolve();
                    }
                }
            });

        // Stream audio data from the recorder to the Speech API
        let silenceThreshold = 200; // Adjust this threshold based on your environment
        let silenceFrames = 0;
        const maxSilenceFrames = 30; // Number of consecutive silence frames to consider as end of speech

        const readAndStreamAudio = async () => {
            while (true) {
                const pcm = await recorder.read();

                // Check for silence
                const isSilent = pcm.every((sample) => Math.abs(sample) < silenceThreshold);
                if (isSilent) {
                    silenceFrames++;
                } else {
                    silenceFrames = 0;
                }

                // Convert Int16Array to Buffer and write to stream
                const audioBuffer = Buffer.from(Int16Array.from(pcm).buffer);
                recognizeStream.write(audioBuffer);

                // Stop if silence detected
                if (silenceFrames > maxSilenceFrames) {
                    console.log('Silence detected, stopping streaming recognition.');
                    recognizeStream.end();
                    break;
                }
            }
        };

        // Start reading and streaming audio
        readAndStreamAudio().catch((err) => {
            console.error('Error streaming audio:', err);
            recognizeStream.end();
            resolve();
        });
    });
}

(async function () {
    try {
        await micDemo();
    } catch (e) {
        console.error('Application error:', e);
    }
})();
