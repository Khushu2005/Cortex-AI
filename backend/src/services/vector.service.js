// Import the Pinecone library correctly
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });


const chatgptcloneIndex = pc.Index('chatgpt-clone'); 

async function createMemory({ vectors, metadata, messageID }) {
    await chatgptcloneIndex.upsert([{
        id: messageID,
        values: vectors,
        metadata: metadata
    }]);
}

async function queryMemory({ queryvector, metadata, limit = 5 }) {
    const data = await chatgptcloneIndex.query({
        vector: queryvector,
        filter: metadata ? metadata : undefined,
        topK: limit,
        includeMetadata: true
    });

    return data.matches;
}

module.exports = { createMemory, queryMemory };