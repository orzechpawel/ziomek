const axios = require("axios");
const fs = require('fs');
const path = require('path');
async function handleGPT(voice) {
    const filePath = path.join(__dirname, '..', 'assets', 'message.txt');
    let message = fs.readFileSync(filePath, 'utf8');
    message = message.replace('--voice--', voice);

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o-mini", // Adjust the model if needed
            messages: [{role: "user", content: message}],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return null;
    }
}

module.exports = handleGPT;
