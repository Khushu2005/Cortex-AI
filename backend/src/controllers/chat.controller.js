const chatModel = require('../models/chat.model');

async function createChat(req, res) {
    const { title } = req.body;
    const user = req.user;

    // --- SAFETY CHECK ---
    if (!user) {
        return res.status(401).json({ message: "User authentication failed" });
    }

    try {
        const chat = await chatModel.create({
            user: user._id,
            title: title
        });

        res.status(201).json({
            message: "Chat created successfully",
            chat: {
                id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating chat" });
    }
}

module.exports = {
    createChat
};