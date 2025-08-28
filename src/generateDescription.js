const fetch = require('node-fetch').default; // node-fetch is needed for HTTP requests in Node.js

async function generateDescription(text) {
    const HUGGING_FACE_API_TOKEN = process.env.HF_API_TOKEN;
    const MODEL_URL = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6"; // A good summarization model

    if (!HUGGING_FACE_API_TOKEN) {
        console.warn("Warning: HF_API_TOKEN environment variable not set. Skipping AI description generation.");
        return text; // Return original text if token is missing
    }

    try {
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HUGGING_FACE_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: text, parameters: { min_length: 50, max_length: 150 } }) // Adjust parameters as needed
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error(`Hugging Face API error: ${response.status} - ${JSON.stringify(errorBody)}`);
            return text; // Return original text on API error
        }

        const result = await response.json();
        if (result && result[0] && result[0].summary_text) {
            return result[0].summary_text;
        } else {
            console.warn("Warning: Unexpected response format from Hugging Face API.");
            return text; // Return original text if response format is unexpected
        }
    } catch (error) {
        console.error("Error generating description:", error);
        return text; // Return original text on network or other errors
    }
}

module.exports = generateDescription;
