const express = require('express');
const chatControl = require('../controls/chatControl')
const authenticate = require('../middeleWare/auth')


const router = express.Router();

router.post('/get-data', authenticate.authenticateUser, chatControl.chatMsg)

module.exports = router;