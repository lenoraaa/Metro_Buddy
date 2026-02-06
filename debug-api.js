const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCVri99SUW2uErA6SWz5gT-3g8C6frNYB0';

async function debugAPIKey() {
    console.log('=== Gemini API Debugging ===\n');

    // Test 1: Check if API key is set
    console.log('1. API Key Check:');
    console.log('   API Key:', API_KEY ? '✓ Set' : '✗ Not set');
    console.log('   Length:', API_KEY.length);
    console.log('');

    // Test 2: Try to initialize
    console.log('2. Initializing Gemini AI...');
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        console.log('   ✓ Initialization successful');
        console.log('');

        // Test 3: Try different models with detailed error info
        const modelsToTest = [
            'gemini-pro',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-2.0-flash-exp'
        ];

        console.log('3. Testing Models:');
        for (const modelName of modelsToTest) {
            try {
                console.log(`\n   Testing: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent('Say "Hello"');
                const response = await result.response;
                const text = response.text();

                console.log(`   ✓ SUCCESS! Model ${modelName} works!`);
                console.log(`   Response: ${text}`);
                return modelName;
            } catch (error) {
                console.log(`   ✗ Failed: ${modelName}`);
                console.log(`   Error: ${error.message}`);

                // Check for specific error types
                if (error.message.includes('API_KEY_INVALID')) {
                    console.log('   → API key is invalid or expired');
                } else if (error.message.includes('404')) {
                    console.log('   → Model not found');
                } else if (error.message.includes('403')) {
                    console.log('   → Permission denied - check API restrictions');
                } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
                    console.log('   → Network connectivity issue');
                }
            }
        }

        console.log('\n❌ All models failed');
        console.log('\nPossible issues:');
        console.log('1. API key might be restricted (check Google AI Studio)');
        console.log('2. Generative AI API not enabled in your project');
        console.log('3. Network/firewall blocking the API');
        console.log('4. API key might need to be regenerated');

    } catch (error) {
        console.log('   ✗ Initialization failed');
        console.log('   Error:', error.message);
    }
}

debugAPIKey();
