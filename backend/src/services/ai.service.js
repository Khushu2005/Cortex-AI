const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let embedder = null;

async function getEmbedder() {
    if (!embedder) {
        console.log("Loading Embedding Model locally...");
        const { pipeline } = await import('@xenova/transformers');
        embedder = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
        console.log("Embedding Model Loaded!");
    }
    return embedder;
}

async function generateEmbedding(text) {
    try {
        const pipe = await getEmbedder();
        const output = await pipe(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (error) {
        console.error("Embedding Error:", error);
        throw error;
    }
}

async function generateResponse(history) {
    try {
        const completion = await groq.chat.completions.create({
            messages: history,
            model: "llama-3.3-70b-versatile",
        });
        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq Chat Error:", error);
        return "Sorry, I am facing issues connecting to Groq AI.";
    }
}

module.exports = { generateResponse, generateEmbedding };