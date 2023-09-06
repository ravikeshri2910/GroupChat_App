const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')


const sequelize = require('./utill/database');
const Users = require('./models/user')
const userROute = require('./router/userRouter')

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/user',userROute)



sequelize
    .sync()
   // .sync({force:true}) // this is use to forcly delete all tables and creates new tables
    .then(result => {
        app.listen(3000)
    })
    .catch(err => console.log(err))
