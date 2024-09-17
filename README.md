<h1>Ziomek: IoT Voice Assistant (Node.js)</h1>
Ziomek is a Node.js-based IoT voice assistant project designed for the Raspberry Pi 4B, using a Jabra Speak 510 as the microphone and speaker. It works in conjunction with Home Assistant to control your smart devices, uses Google Speech-to-Text for voice recognition, and leverages ChatGPT for natural language understanding and conversation analysis.

https://github.com/user-attachments/assets/0bfee80c-e16a-48cc-92e1-b339bc1cb6f9

The assistant reacts to the wake words "Hej ziomek," listens to your commands, and performs tasks like controlling devices, checking flight information (for AvGeeks), getting weather updates, and adding items to a personalized shopping list.

Features
- Smart Home Control: Voice-activated control of smart devices via Home Assistant.
- Flight Information: Fetch real-time nearby flight information.
- Weather Updates: Get the latest weather details.
- Shopping List Management: Add items to your shopping list with voice commands.
- Google Speech-to-Text: Speech recognition via Google’s API.
- ChatGPT Integration: Natural language processing and command handling using OpenAI's GPT models.
- [Optionally] - it has the caching mechanism introduced for limit the gpt calls - you can implement own solution here `controller/SearchInCache.js`

Hardware Requirements
- Raspberry Pi 4B
- Jabra Speak 510 (or other compatible microphone/speaker)
- Internet connection (WiFi or Ethernet)
- Smart devices managed by Home Assistant (e.g., lights, plugs)

Software Requirements
- Node.js (v18 or higher)
- Home Assistant instance for smart home control (especially Long-Lived access token)
- Google Cloud Speech-to-Text API for speech recognition
- OpenAI API key for using ChatGPT
- Various Node.js dependencies (listed in package.json)

<h3>Important Notes</h3>
This project will not work out of the box! You need to adjust environment variables and settings in several files (mainly in config.js, .env, and other configuration files). Make sure to:

1. Set up your Google Cloud project with Speech-to-Text enabled.
2. Buy some tokens and configure your OpenAI API key.
3. Customize the Home Assistant integration to match your devices.


```bash
pm2 start index.js
```
