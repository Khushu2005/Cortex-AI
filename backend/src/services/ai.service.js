require('dotenv').config();
const Groq = require("groq-sdk");
const axios = require("axios");

// ✅ Groq Setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ NEW HuggingFace Model Setup
const HF_MODEL = "BAAI/bge-base-en-v1.5";
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: [text] // HF expects array input
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true" // 🔥 Important: Wait if model is loading
        }
      }
    );

    // ✅ Response structure handle karna
    if (Array.isArray(response.data) && response.data.length > 0) {
        // Agar nested array hai [[0.1, 0.2...]] (Standard HF response)
        if (Array.isArray(response.data[0])) {
            return response.data[0]; 
        }
        // Agar flat array hai [0.1, 0.2...]
        return response.data;
    }
    
    throw new Error("Invalid embedding response format");

  } catch (error) {
    console.error("❌ HF EMBEDDING ERROR");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.error || error.message);
    throw error;
  }
}

async function generateResponse(history) {
    try {
       const systemPrompt = {
         role: "system",
         content: `<system_instruction>
        <meta>
          <name>Cortex AI</name>
          <version>4.3</version>
          <author>User</author>
        </meta>
        <persona>
          You are Cortex AI. Helpful, polite, and natural.
        </persona>
        <tone_and_style>
          Speak in Simple Hinglish. Be neutral and polite.
        </tone_and_style>
        </system_instruction>`
       };

        const completion = await groq.chat.completions.create({
            messages: [systemPrompt, ...history],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq Chat Error:", error);
        return "Arrey yaar, Groq AI connect nahi ho pa raha. Zara internet check kar ya API key dekh le.";
    }
}

module.exports = { generateResponse, generateEmbedding };