const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

console.log("Auth Middleware:", authMiddleware.authUser);
console.log("Chat Controller:", chatController.createChat);

router.post('/', authMiddleware.authUser, chatController.createChat);


module.exports = router;