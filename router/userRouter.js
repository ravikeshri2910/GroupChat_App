const express = require('express');
const userControl = require('../controls/userControl')


const router = express.Router();

router.post('/chat-sinup-data',userControl.sinupRoute)


module.exports = router;