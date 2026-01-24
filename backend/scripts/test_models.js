const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const testModel = async (modelName) => {
    try {
        console.log(`Testing ${modelName}...`);
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: "Hi" }] }]
            }
        );
        console.log(`✅ SUCCESS: ${modelName} is working!`);
        return true;
    } catch (error) {
        if (error.response) {
            console.log(`❌ FAILED: ${modelName} - Status: ${error.response.status} (${error.response.statusText})`);
            // console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`❌ FAILED: ${modelName} - ${error.message}`);
        }
        return false;
    }
};

const findWorkingModel = async () => {
    console.log("🔍 Fetching list of models...");
    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        const models = response.data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace('models/', ''));

        console.log(`Found ${models.length} candidate models.`);

        for (const model of models) {
            const works = await testModel(model);
            if (works) {
                console.log(`\n🎉 FOUND WORKING MODEL: ${model}`);
                const fs = require('fs');
                fs.writeFileSync(path.join(__dirname, 'working_model.txt'), model);
                console.log(`👉 Saved to working_model.txt`);
                return;
            }
        }
        console.log("\n❌ No working models found. Please check your API key quotas.");

    } catch (error) {
        console.error("Error fetching model list:", error.message);
    }
};

findWorkingModel();
