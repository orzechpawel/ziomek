const axios = require("axios");
async function searchInCache(voice) {
    try {
        const response = await axios.post('http://...:3000/find-query', {
            sentence: voice, // Adjust to use the actual transcript or input
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.schemaObject; // Return the schemaObject
    } catch (error) {
        console.error('Error calling the API:', error);
        return null;
    }
}
module.exports = searchInCache;
