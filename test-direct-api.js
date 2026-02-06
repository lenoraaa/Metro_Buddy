// Test using direct fetch instead of SDK
const API_KEY = 'AIzaSyCVri99SUW2uErA6SWz5gT-3g8C6frNYB0';

async function testDirectAPI() {
    console.log('=== Testing Direct API Call ===\n');

    // Try v1 endpoint (not v1beta)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: 'Say "Hello, API is working!"'
            }]
        }]
    };

    try {
        console.log('Making direct API call to v1 endpoint...');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', errorText);
            return false;
        }

        const data = await response.json();
        console.log('\n✅ SUCCESS!');
        console.log('Response:', JSON.stringify(data, null, 2));
        return true;

    } catch (error) {
        console.log('❌ Error:', error.message);
        return false;
    }
}

testDirectAPI();
