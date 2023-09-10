const express = require('express');
const chatControl = require('../controls/chatControl')
const authenticate = require('../middeleWare/auth')


const router = express.Router();

router.post('/send-data/:groupid', authenticate.authenticateUser, chatControl.chatMsg)

router.get('/get-data/:groupId', authenticate.authenticateUser, chatControl.getMsg)

router.post('/group-name', authenticate.authenticateUser, chatControl.creategroup)

router.get('/join-group/:id', authenticate.authenticateUser, chatControl.joinGroup)

router.get('/group-data/:groupId/:userId', authenticate.authenticateUser, chatControl.groupData)

module.exports = router;