const searchInCache = require('./SearchInCache');
const handleGPT = require('./HandleGPT');

async function getVoiceInterpretation (voice) {
    let results = await searchInCache(voice);
    console.log(results); // You confirmed this logs the expected object

    if (results === undefined) {
        let gptResponse = await handleGPT(voice);
        results = JSON.parse(gptResponse);
    } else {
        // Assuming results.schemaObject exists and you want to use it if available
        // If not, just return results or adjust accordingly
        results = results.schemaObject ? results.schemaObject : results;
    }

    // Return the results object or the specific value you need from it
    return results;
}
module.exports = getVoiceInterpretation;