const express = require("express");

const router = express.Router();

const chatController = require('../controllers/chatController');

router.post('/chat', chatController.createChat);
router.get('/chats', chatController.getChats);

module.exports = router;