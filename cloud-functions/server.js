const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const cors = require('cors'); // Essential for connecting the mobile app

dotenv.config();
const app = express();
const port = 8080;

// Middleware setup
app.use(express.json());
// Allow the mobile app to talk to the server
app.use(cors({ origin: '*' })); 

// Initialize Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// Simulate a raw security log from the Sentinel Agent
const RAW_SECURITY_LOG = {
    event: "Mass File Encryption Spike",
    source_ip: "192.168.1.15",
    user: "John_Doe",
    risk_score_raw: 92,
    timestamp: new Date().toISOString()
};

// --- API Endpoint: The AI Analysis ---
app.post('/api/analyse-threat', async (req, res) => {
    
    // The prompt is the "AI Architecture" - forcing structured output!
    const prompt = `
        You are an expert security analyst for a non-technical small business owner.
        Analyze the raw security log provided below and execute the following tasks:
        1. Determine a non-technical, overall 'Security Score' (0-100) based on the threat. 
        2. Translate the threat into a single, short, non-technical alert message.
        3. Determine the required action: "FIX_IT_NOW" or "SAFE".

        RAW LOG: ${JSON.stringify(RAW_SECURITY_LOG, null, 2)}

        Format the ENTIRE response as a clean JSON object with keys: 
        score (integer), message (string), and action (string).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Fast and cheap for MVP
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const aiOutput = JSON.parse(response.text.trim());
        
        // Add the critical business logic to the AI output
        if (aiOutput.action === "FIX_IT_NOW") {
             aiOutput.status_color = "red";
        } else {
             aiOutput.status_color = "green";
        }

        res.json(aiOutput);

    } catch (error) {
        console.error("AI Analysis Error:", error);
        // Fallback for demo in case API key is missing or invalid
        res.status(200).json({
            score: 45,
            message: "Local Sentinel Agent detected a serious issue.",
            action: "FIX_IT_NOW",
            status_color: "red",
            error: "SIMULATED FALLBACK: AI API Failure"
        });
    }
});

app.listen(port, () => {
    console.log(`Sentinel Sigma AI Backend running on http://localhost:${port}`);
    console.log('Use /api/analyse-threat POST to test.');
});