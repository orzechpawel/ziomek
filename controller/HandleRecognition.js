const {exec} = require('child_process');
const util = require('util');
const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');
const ttsClient = new textToSpeech.TextToSpeechClient();
const getVoiceInterpretation = require('./GetVoiceInterpretation');
const getTime = require('./custom/GetTime');
const getWeather = require('./custom/GetWeather');
const addShopping = require('./custom/AddShopping');
const getFlights = require('./custom/GetFlights');
const handleSwitch = require('./HandleSwitch');
const mic = require('mic');
const customQueries = ['__TIME__', '__WEATHER__', '__SHOPPING__', '__FLIGHT__'];

const micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: false,
    exitOnSilence: 150,
    device: 'dsnoop:CARD=USB,DEV=0'
});

async function handleRecognition(data) {
    console.log(
        `Transcription: ${data.results[0] && data.results[0].alternatives[0]
            ? data.results[0].alternatives[0].transcript
            : '\n\nReached transcription time limit, press Ctrl+C\n'}`
    );

    if (data.results[0] && data.results[0].alternatives[0]) {
        exec('aplay ~/johny/sent.wav', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
        });

        getVoiceInterpretation(data.results[0].alternatives[0].transcript).then(async (response) => {
            const jRes = response;
            const isMessageInCustomQueries = customQueries.includes(response.message);
            if (isMessageInCustomQueries) {
                switch (response.message) {
                    case '__TIME__': {
                        response.message = getTime();
                        break;
                    }
                    case '__WEATHER__': {
                        await getWeather().then(weather => {
                            response.message = weather;
                        })
                        break;
                    }
                    case '__SHOPPING__': {
                        await addShopping(response.items).then(res => {
                            response.message = res;
                        })
                        break;
                    }
                    case '__FLIGHT__': {
                        await getFlights().then(res => {
                            response.message = res;
                        })
                        break;
                    }
                }

            }
            console.log(response.message);
            await handleSwitch(jRes).then(async () => {
                // Construct the request for the Google Text-to-Speech API
                const request = {
                    input: {text: jRes.message},
                    // Select the language and SSML Voice Gender (optional)
                    voice: {languageCode: 'pl-PL', ssmlGender: 'NEUTRAL', name: 'pl-PL-Wavenet-B'},
                    // Select the type of audio encoding
                    audioConfig: {audioEncoding: 'LINEAR16', speed: 1.2},
                };
                try {
                    const [response] = await ttsClient.synthesizeSpeech(request);
                    const writeFile = util.promisify(fs.writeFile);
                    await writeFile('output.wav', response.audioContent, 'binary');
                    micInstance.stop();
                    exec('aplay output.wav', (error, stdout, stderr) => {
                        process.exit(0);
                    });
                    // Add code to play 'output.mp3' file
                } catch (error) {
                    console.error('Error calling Google Text-to-Speech API:', error);
                }
            });

        });
    }
};

module.exports = handleRecognition;
