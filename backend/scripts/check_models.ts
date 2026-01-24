import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const listModels = async () => {
    console.log("🔍 Checking available Gemini models for your API Key...");
    console.log(`🔑 Using Key: ${apiKey.substring(0, 10)}...`);

    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        console.log("\n✅ AVAILABLE MODELS:");
        const models = response.data.models;

        if (models && models.length > 0) {
            models.forEach((m: any) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`   - ${m.name.replace('models/', '')}`);
                }
            });
            console.log("\n👉 Please pick one of the above names for your GeminiAIService.ts");
        } else {
            console.warn("⚠️ No models found in the response.");
        }

    } catch (error: any) {
        console.error("\n❌ Error fetching models:");
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(`   Message: ${error.message}`);
        }
    }
};

listModels();
