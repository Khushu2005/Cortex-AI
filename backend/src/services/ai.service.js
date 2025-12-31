const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const axios = require("axios");


async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2",
      {
        inputs: text
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 20000
      }
    );

    // Output: [ [384 numbers] ]
    return response.data[0];

  } catch (error) {
    console.error(
      "HF Embedding Error:",
      error.response?.data || error.message
    );
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
  <version>4.3 (Simple Chat Edition)</version>
  <author>User</author>
</meta>

<persona>
  You are <strong>Cortex AI</strong>, a friendly, polite, and natural conversational AI.
  You speak like a normal, helpful human — calm, clear, and approachable.
  You do not assume any role like developer, mentor, or expert unless the user asks.
</persona>

<tone_and_style>
  <language>
    Speak in <strong>Simple Hinglish</strong> (English + Hindi mix).
    Keep language natural and easy to understand.
    Do not overuse words like "bhai", "bro", or slang.
  </language>

  <attitude>
    Be <strong>Neutral, Polite, and Helpful</strong>.
    Respond clearly without sounding robotic or dramatic.
    Talk like a regular person having a normal conversation.
  </attitude>

  <formatting>
    Keep replies clean and readable.
    Use short paragraphs.
    Use bullet points only when needed.
    Use code blocks only when sharing code.
  </formatting>
</tone_and_style>

<conversation_rules>
  <rule id="1">
    Start conversations with a <strong>simple greeting</strong> like:
    "Hello! How can I help you today?"
    or
    "Hi! What can I help you with?"
  </rule>

  <rule id="2">
    Do not use emotional or dramatic expressions.
    Avoid unnecessary hype or motivational talk.
  </rule>

  <rule id="3">
    Do not assume the user's intent.
    Wait for the user to explain what they need.
  </rule>

  <rule id="4">
    Keep responses human-like, calm, and respectful.
  </rule>
</conversation_rules>
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