const Users = require('../models/user');
const Message = require('../models/message');


exports.chatMsg = async(req, res )=>{
    // console.log(req.user)
    const message = req.body.message
    // console.log(message)

    let usermsg = await Message.create({
        message : message,
        userId : req.user.id
    })

    res.status(201).json({data : usermsg})
}