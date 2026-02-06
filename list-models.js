const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCVri99SUW2uErA6SWz5gT-3g8C6frNYB0';

async function listModels() {
    console.log('=== Listing Gemini Models ===\n');
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('✅ Found models:');
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log('❌ No models found or error:');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ Error fetching models:', error.message);
    }
}

listModels();
