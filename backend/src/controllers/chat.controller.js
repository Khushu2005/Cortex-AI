const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');


async function createChat(req, res) {
    const { title } = req.body;
    const user = req.user;

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


async function updateChatTitle(req, res) {
    
    const { chatId } = req.params;
    
   
    const { title } = req.body;
    
  
    const user = req.user;

   
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        
        const updatedChat = await chatModel.findOneAndUpdate(
            { _id: chatId, user: user._id }, 
            { title: title },                
            { new: true }                   
        );

        
        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

        res.status(200).json({
            message: "Chat title updated successfully",
            chat: {
                id: updatedChat._id,
                title: updatedChat.title,
                lastActivity: updatedChat.lastActivity
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating chat title" });
    }
}


async function deleteChat(req, res) {
    
    const { chatId } = req.params;
    
    
    const user = req.user;

    try {
      
        const deletedChat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: user._id
        });

      
        if (!deletedChat) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

   
        res.status(200).json({
            message: "Chat deleted successfully",
            chatId: deletedChat._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting chat" });
    }
}

async function getAllChats(req, res) {
    try {
      
        const chats = await chatModel.find({ user: req.user._id }).sort({ updatedAt: -1 });
        
        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({ message: "Error fetching chats" });
    }
}


async function getChatById(req, res) {
    const { chatId } = req.params;
    
    try {
       
        const chat = await chatModel.findOne({ _id: chatId, user: req.user._id });
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

    
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

       
        res.status(200).json({
            chat: {
                ...chat.toObject(),
                messages: messages 
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching chat history" });
    }
}


module.exports = {
    createChat,
    updateChatTitle,
    deleteChat,
    getAllChats,
    getChatById
};