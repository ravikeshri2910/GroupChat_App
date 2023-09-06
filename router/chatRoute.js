const express = require('express');
const chatControl = require('../controls/chatControl')
const authenticate = require('../middeleWare/auth')


const router = express.Router();

router.post('/send-data', authenticate.authenticateUser, chatControl.chatMsg)

router.get('/get-data', authenticate.authenticateUser, chatControl.getMsg)

module.exports = router;