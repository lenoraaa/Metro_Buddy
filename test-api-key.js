const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyDC1xZnVCYbD2_QgyRRzee1eFJx5vtfO8k';

async function testAllModels() {
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-2.0-flash-exp'];

    for (const modelName of models) {
        try {
            console.log(`\nTesting model: ${modelName}...`);
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent('Say "Hello" if you can read this.');
            const response = await result.response;
            const text = response.text();

            console.log(`✅ ${modelName} WORKS!`);
            console.log(`Response: ${text}`);
            return modelName;
        } catch (error) {
            console.log(`❌ ${modelName} failed: ${error.message.substring(0, 100)}`);
        }
    }

    console.log('\n❌ All models failed. There may be a network or API restriction issue.');
    return null;
}

testAllModels();
