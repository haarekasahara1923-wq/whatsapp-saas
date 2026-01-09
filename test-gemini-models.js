
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded for testing only - will be deleted immediately
const API_KEY = "AIzaSyBwOUErffADQAS_zTzaaMKR_bFRtSgIF9o";

async function listModels() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    try {
        // We can't list models easily with just the high level SDK in this version without a workaround or checking docs, 
        // but we can try to generate with a few common names and see which one succeeds.

        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

        for (const modelName of modelsToTry) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, world!");
                const response = await result.response;
                console.log(`SUCCESS: ${modelName} worked! Response: ${response.text()}`);
                return; // Exit on first success
            } catch (e) {
                console.log(`FAILED: ${modelName} - ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Critical Error", error);
    }
}

listModels();
