const express = require("express");

const router = express.Router();

const messageController = require('../controllers/messageController');

router.get('/messages', messageController.getMesssages);
router.post('/messages/new', messageController.sendNewMessage);

module.exports = router;