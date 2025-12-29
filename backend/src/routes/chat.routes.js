const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

console.log("Auth Middleware:", authMiddleware.authUser);
console.log("Chat Controller:", chatController.createChat);
router.post('/', authMiddleware.authUser, chatController.createChat);
router.put('/:chatId', authMiddleware.authUser, chatController.updateChatTitle);
router.delete('/:chatId', authMiddleware.authUser, chatController.deleteChat);
router.get('/', authMiddleware.authUser, chatController.getAllChats);
router.get('/:chatId', authMiddleware.authUser, chatController.getChatById);


module.exports = router;