// Add this at the very top
require("dotenv").config({ path: ".env.local" });

const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    // Try different model names
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-latest",
      "gemini-2.5-pro",
      "gemini-2.5-pro-latest",
      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-1.0-pro-latest",
      "models/gemini-1.5-flash",
      "models/gemini-pro",
    ];

    console.log("Testing available models...\n");

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hi");
        console.log(`✅ ${modelName} - WORKS!`);
        console.log(`   Response: ${result.response.text()}\n`);
      } catch (error) {
        console.log(`❌ ${modelName} - Failed: ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
