const bcrypt = require('bcrypt')



const Users = require('../models/user');

exports.sinupRoute = async (req, res) => {

    try {
        const { name, email, password, phone } = req.body


        let oldUser = await Users.findOne({ where: { email: email } })
        // console.log(oldUser)
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