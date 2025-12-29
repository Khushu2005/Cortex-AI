const { Server } = require('socket.io')
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const aiService = require('../services/ai.service');
const messageModel = require('../models/message.model');
const { createMemory, queryMemory } = require('../services/vector.service');


function initSocketServer(httpServer) {
 
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173", 
            methods: ["GET", "POST"],
            credentials: true 
        }
    });

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);
            const user = await userModel.findById(decoded.id);

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            console.log("User Connected:", user?.fullname?.firstname);
            socket.user = user;
            next();

        } catch (err) {
            return next(new Error('Authentication error: Invalid or expired token'));
        }
    })

    io.on('connection', (socket) => {

        socket.on('ai-message', async (messagePayload) => {
            try {
                if (typeof messagePayload === 'string') {
                    messagePayload = JSON.parse(messagePayload);
                }
                const userId = socket.user._id.toString();

                const [savedUserMsg, userVector] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: userId,
                        content: messagePayload.content,
                        role: 'user'
                    }),
                    aiService.generateEmbedding(messagePayload.content)

                ])

                await createMemory({
                    vectors: userVector,
                    metadata: {
                        chat: messagePayload.chat,
                        userId: userId,
                        text: messagePayload.content,
                        role: 'user'
                    },
                    messageID: savedUserMsg._id.toString()
                });

                let [matches, chatHistory] = await Promise.all([
                    queryMemory({
                        queryvector: userVector,
                        metadata: { userId: userId },
                        limit: 3
                    }),

                    messageModel.find({
                        chat: messagePayload.chat
                    })
                        .sort({ createdAt: -1 })
                        .limit(10)
                        .lean()
                ]);

                chatHistory = chatHistory.reverse();

                let context = "";

                if (matches && matches.length > 0) {
                    context = matches.map(match => match.metadata.text).join("\n");
                    console.log("Long-Term Context Found:", matches.length);
                }

                const historyForAi = chatHistory.map(item => {
                    return {
                        role: (item.role === 'user') ? 'user' : 'assistant',
                        content: item.content
                    }
                });
                if (context) {
                    historyForAi.unshift({
                        role: 'system',
                        content: `You have access to the user's past memories from different conversations. Use the following context to answer efficiently.\n\nPast Memories:\n${context}`
                    });
                }

                // Consoling short term and long term memory
                console.log("\n--------------------------------------------------");

                // 1. Long Term Memory
                console.log(" Long Term :");

                const formattedLongTerm = context ? context.split("\n") : ["No relevant past memories found."];
                console.log(JSON.stringify(formattedLongTerm, null, 2));

                console.log("\n--------------------------------------------------");

                // 2. Short Term Memory 
                console.log(" Short Term  :");
                const cleanShortTerm = historyForAi.filter(msg => msg.role !== 'system');
                console.log(JSON.stringify(cleanShortTerm, null, 2));

                console.log("--------------------------------------------------\n");



                //  Generate Response
                const response = await aiService.generateResponse(historyForAi);

                //  Send Response
                socket.emit('ai-response', {
                    content: response,
                    chat: messagePayload.chat
                });

                const [savedAiMsg, aiVector] = await Promise.all([
                    messageModel.create({
                        chat: messagePayload.chat,
                        user: userId,
                        content: response,
                        role: 'model'
                    }),
                    aiService.generateEmbedding(response)
                ]);

                await createMemory({
                    vectors: aiVector,
                    metadata: {
                        chat: messagePayload.chat,
                        userId: userId,
                        text: response,
                        role: 'model'
                    },
                    messageID: savedAiMsg._id.toString()
                });

            } catch (error) {
                console.error("Error:", error);
                socket.emit('error', { message: error.message });
            }
        })
    });
}

module.exports = initSocketServer;