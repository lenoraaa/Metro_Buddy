import { RouteData, RouteRequest } from '@/types/route';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service - Gemini API Integration
 * Uses Gemini API for intelligent route guidance
 * Falls back to demo data if API is unavailable
 */

// Initialize Gemini AI
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

const DEMO_ROUTES: Record<string, RouteData> = {
    'central-parkstreet': {
        line_color: 'Blue',
        start_station: 'Central',
        destination_station: 'Park Street',
        total_stops: 5,
        transfer_required: false,
        steps: [
            'Go to the Blue Line platform',
            'Stay on the train for five stops',
            'Get down at Park Street'
        ],
        audio_script: [
            'Start at Central Station.',
            'Take the Blue Line towards Park Street.',
            'It is 5 stops away.',
            'You will arrive in about 15 minutes.'
        ],
        visual_icons: ['🚉', '➡️', '🏁'],
        confidence_message: 'Route verified by Metro AI',
        ai_insight: '✨ Tip: This is a direct line. The 3rd car usually has more empty seats!',
        smart_steps: [
            {
                id: 1, type: 'entry', icon: '🚉',
                instruction: 'Enter Central Station',
                audio_text: 'You are at Central Station. Enter through Gate 3.',
                metadata: { gate: '3' }
            },
            {
                id: 2, type: 'ticket', icon: '🎟️',
                instruction: 'Buy Single Ticket',
                audio_text: 'Go to the machine. Buy a Single Journey Ticket. It costs 2 dollars.',
                visual_cue: 'Blue Ticket Machine',
                metadata: { cost: '$2', ticket_type: 'Single Journey' }
            },
            {
                id: 3, type: 'platform', icon: '⬇️',
                instruction: 'Go to Platform 1',
                audio_text: 'Go down to Platform 1. Follow the Blue Line signs.',
                metadata: { platform: '1' }
            },
            {
                id: 4, type: 'board', icon: '🚆',
                instruction: 'Board Blue Line',
                audio_text: 'The train is arriving. Board the Blue Line towards Airport.',
                visual_cue: 'Blue Train'
            },
            {
                id: 5, type: 'ride', icon: '⏱️',
                instruction: 'Ride 5 stops',
                audio_text: 'Relax. Stay on for 5 stops. I will tell you when to get off.',
            },
            {
                id: 6, type: 'exit', icon: '🏁',
                instruction: 'Exit at Park Street',
                audio_text: 'You have arrived at Park Street. Exit on the left side.',
                metadata: { landmark: 'City Mall 🛍️' }
            }
        ]
    },
    'central-riverside': {
        line_color: 'Purple',
        start_station: 'Central',
        destination_station: 'Riverside',
        total_stops: 8,
        transfer_required: true,
        steps: [
            'Take Blue Line to Junction Station',
            'Transfer to Purple Line',
            'Take Purple Line to Riverside'
        ],
        audio_script: [
            'Take the Blue Line to Junction Station.',
            'Get off and transfer to the Purple Line.',
            'Ride 3 more stops to Riverside.'
        ],
        visual_icons: ['🚆', 'chk_transfer', '🏁'],
        confidence_message: 'Route verified with 1 transfer',
        ai_insight: '✨ Insight: This transfer at Junction Station has elevators near the front of the train.',
        smart_steps: [
            {
                id: 1, type: 'entry', icon: '🚉',
                instruction: 'Enter Central Station',
                audio_text: 'Enter Central Station through the main gate.',
            },
            {
                id: 2, type: 'board', icon: '🚆',
                instruction: 'Board Blue Line',
                audio_text: 'Board the Blue Line towards Junction Station.',
            },
            {
                id: 3, type: 'transfer', icon: '🔁',
                instruction: 'Transfer at Junction',
                audio_text: 'Get off at Junction Station. Follow the Purple Line signs to Platform 4.',
                visual_cue: 'Follow Purple Footsteps',
                metadata: { platform: '4' }
            },
            {
                id: 4, type: 'board', icon: '🚆',
                instruction: 'Board Purple Line',
                audio_text: 'Board the Purple Line towards Riverside.',
            },
            {
                id: 5, type: 'exit', icon: '🏁',
                instruction: 'Exit at Riverside',
                audio_text: 'You are at Riverside. Exit the station.',
            }
        ]
    },
    'downtown-airport': {
        line_color: 'Green',
        start_station: 'Downtown',
        destination_station: 'Airport',
        total_stops: 12,
        transfer_required: false,
        steps: ['Board Green Line', 'Go to Airport'],
        audio_script: ['Take the Green Line directly to the Airport.'],
        visual_icons: ['✈️'],
        confidence_message: 'Direct airport shuttle.',
        smart_steps: []
    }
};

const SYSTEM_PROMPT = `
You are a helpful Metro Assistant for people with dyslexia.
Generate a JSON response for a route from {start} to {destination}.
Structure:
{
    "line_color": "Blue" | "Red" | "Green" | "Yellow",
    "total_stops": number,
    "transfer_required": boolean,
    "steps": ["Step 1"],
    "visual_icons": ["icon1"],
    "audio_script": ["script1"],
    "confidence_message": "Short message",
    "ai_insight": "Helpful tip",
    "smart_steps": [
        {
            "id": number,
            "type": "entry" | "ticket" | "platform" | "board" | "ride" | "transfer" | "exit",
            "instruction": "Short text (max 5 words)",
            "audio_text": "Spoken instruction (simple, clear, reassuring)",
            "icon": "emoji",
            "visual_cue": "visual object to look for",
            "metadata": {
                "platform": "number",
                "gate": "number",
                "cost": "price",
                "ticket_type": "type",
                "landmark": "name"
            }
        }
    ]
}
Rules:
1. Break journey into SMALL steps: Entry -> Ticket -> Platform -> Board -> Ride -> Exit.
2. smart_steps.audio_text should be conversational and very simple.
3. Use emojis for icons.
`;

/**
 * Generate route key from request
 */
function getRouteKey(request: RouteRequest): string {
    return `${request.start_station.toLowerCase().replace(/\s+/g, '')}-${request.destination_station.toLowerCase().replace(/\s+/g, '')}`;
}

/**
 * Get demo route data
 */
function getDemoRoute(request: RouteRequest): RouteData | null {
    const routeKey = getRouteKey(request);
    return DEMO_ROUTES[routeKey] || null;
}

/**
 * Create prompt for Gemini API
 */
function createRoutePrompt(request: RouteRequest): string {
    return `You are a helpful metro route assistant designed for dyslexic users. Provide SIMPLE, CLEAR route guidance.

START STATION: ${request.start_station}
DESTINATION STATION: ${request.destination_station}

IMPORTANT RULES:
1. Use SIMPLE words (avoid complex terms)
2. Use SHORT sentences
3. Use NUMBERS as words (e.g., "five stops" not "5 stops")
4. Be ENCOURAGING and REASSURING
5. Break down into CLEAR steps

Respond ONLY with valid JSON in this EXACT format:
{
  "line_color": "Blue",
  "start_station": "${request.start_station}",
  "destination_station": "${request.destination_station}",
  "total_stops": 5,
  "transfer_required": false,
  "steps": [
    "Go to the Blue Line platform",
    "Stay on the train for five stops",
    "Get down at Park Street"
  ],
  "audio_script": [
    "You are on the Blue Line.",
    "Stay on the train for five stops.",
    "Get down at Park Street."
  ],
  "visual_icons": ["🚉", "➡️", "🏁"],
  "confidence_message": "You are on the right route."
}

If transfer is needed, add transfer steps and use 🔁 icon. Keep language SIMPLE and CLEAR.`;
}

/**
 * Get route data using Gemini API
 */
async function getRouteFromAPI(request: RouteRequest): Promise<RouteData | null> {
    if (!genAI) {
        console.log('Gemini API not initialized, using demo mode');
        return null;
    }

    // Try multiple models in order of preference
    const modelsToTry = [
        'gemini-3-flash-preview',
        'gemini-3-pro-preview',
        'gemini-2.0-flash',
        'gemini-flash-latest',
        'gemini-pro-latest'
    ];

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = createRoutePrompt(request);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response (handle markdown code blocks)
            let jsonText = text.trim();
            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/```\n?/g, '');
            }

            const routeData = JSON.parse(jsonText);
            console.log(`✅ Route generated by Gemini API using model: ${modelName}`);
            return routeData;
        } catch (error: any) {
            // If it's a 404 model not found error, try next model
            if (error?.message?.includes('404') || error?.message?.includes('not found')) {
                console.log(`Model ${modelName} not available, trying next...`);
                continue;
            }
            // For other errors, log and try next model
            console.error(`Error with model ${modelName}:`, error?.message);
        }
    }

    // All models failed
    console.log('All Gemini models failed, falling back to demo mode');
    return null;
}

/**
 * Analyze an image using Gemini Vision
 */
export async function analyzeImage(imageBase64: string, prompt: string): Promise<string> {
    console.log('[analyzeImage] Starting analysis...');
    console.log('[analyzeImage] API Key present:', !!API_KEY);
    console.log('[analyzeImage] genAI initialized:', !!genAI);

    if (!genAI) {
        console.warn('[analyzeImage] genAI not initialized - returning demo response');
        return "Demo Mode: Gemini API not available. This is a simulated response.";
    }

    try {
        // Use gemini-2.5-flash for vision
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log('[analyzeImage] Model created successfully');

        // Remove header from base64 if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        console.log('[analyzeImage] Image data length:', base64Data.length);

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const responseText = result.response.text();
        console.log('[analyzeImage] Success! Response:', responseText);
        return responseText;
    } catch (error: any) {
        console.error("[analyzeImage] Vision Error:", error);
        console.error("[analyzeImage] Error details:", {
            message: error.message,
            status: error.status,
            statusText: error.statusText
        });
        return `Sorry, I couldn't analyze that image. Error: ${error.message}`;
    }
}


/**
 * Get route data for a given request
 * Tries Gemini API first, falls back to demo data
 */
export async function getRouteData(request: RouteRequest): Promise<RouteData | null> {
    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Try Gemini API first
    const apiRoute = await getRouteFromAPI(request);
    if (apiRoute) {
        return apiRoute;
    }

    // Fallback to demo data
    console.log('Using demo route data');
    return getDemoRoute(request);
}

/**
 * Get list of available demo stations
 */
// Station Data with Landmarks
const STATIONS = [
    { id: '1', name: 'Central', landmark: 'Main City Hub 🏙️', phonetic: 'Cen-tral' },
    { id: '2', name: 'Park Street', landmark: 'City Mall Area 🛍️', phonetic: 'Park Street' },
    { id: '3', name: 'Riverside', landmark: 'River View 🌊', phonetic: 'River-side' },
    { id: '4', name: 'Junction Station', landmark: 'Change Trains 🔁', phonetic: 'Junc-tion' },
    { id: '5', name: 'Downtown', landmark: 'Business District 💼', phonetic: 'Down-town' },
    { id: '6', name: 'Airport', landmark: 'Flights ✈️', phonetic: 'Air-port' }
];

/**
 * Parse natural language intent using Gemini
 */
export async function parseIntent(text: string): Promise<{ start?: string; destination?: string } | null> {
    if (!genAI) {
        console.warn("Gemini API not available for intent parsing");
        return null;
    }

    try {
        // Use gemini-2.5-flash for reliability and speed
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const stationsList = STATIONS.map(s => s.name).join(', ');

        const prompt = `
            You are a Metro Assistant.
            User said: "${text}"
            Stations: ${stationsList}
            
            Return JSON ONLY:
            {
                "start": "Matched Station Name" or null,
                "destination": "Matched Station Name" or null
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let jsonText = response.text().trim();

        // Robust JSON extraction
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return null;
    } catch (error) {
        console.error("Intent parsing failed:", error);
        return null;
    }
}

export function getDemoStations() {
    return STATIONS;
}
