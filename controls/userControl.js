const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const Users = require('../models/user');

exports.sinupRoute = async (req, res) => {

    try {
        const { name, email, password, phone } = req.body


        let oldUser = await Users.findOne({ where: { email: email } })
        console.log(oldUser)
        if (oldUser) {
            return res.status(400).json({ msg: 'Email Already Registered' })
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log("bcrypt err" + err)
            if (!err) {

                let d = await Users.create({
                    name: name,
                    email: email,
                    password: hash,
                    phone: phone
                })
                res.status(201).json({ msg: 'Regitered', data: d })
            }
        })


    } catch (err) {
        console.log('err>>>>>>>>' + err)

    }

}

function generateWebToken(id) {
    return jwt.sign({ userId: id }, 'secretkey')

}

exports.login = async (req, res) => {
    try {
        const logInemail = req.body.email
        const logInPassword = req.body.password

        const user = await Users.findOne({ where: { email: logInemail } })

        console.log('id+' + user)
        if(user == null){
            return res.status(404).json({msg : "Email wrong"})
        }

        bcrypt.compare(logInPassword, user.password, (err, result) => {
            if (err) {
                res.status(500).json({ msg: 'Something is wrong' })
            }
            if (result == true) {
                res.status(201).json({ userdetails: user, token: generateWebToken(user.id) })
            } else {
                res.status(401).json({ msg: 'Incorrect Password' })
            }
        })

    } catch (err) {
        // console.log(' err msg -'+ err)
        if (err == "TypeError: Cannot read properties of undefined (reading 'passWord')") {

            res.status(404).json(err)
        }
    }
}