const jwt = require('jsonwebtoken');
const Users = require('../models/user');


exports.authenticateUser = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        // console.log(" >>>>>>>>"+token)

        const user = jwt.verify(token, 'secretkey');

        // console.log('user >>>>>'+user.userId)
        Users.findByPk(user.userId).then(user =>{
            req.user = user;
            // console.log('autothe')
            // console.log('user >>>>'+JSON.stringify(req.user));
            next();
        }).catch(err => {throw new Error(err)})
    }catch(err) {console.log(err)}
} 

