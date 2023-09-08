const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')


const sequelize = require('./utill/database');
const Users = require('./models/user')
const Group = require('./models/group')
const Message = require('./models/message')
const Groupmembers = require('./models/groupmemeber')
const userROute = require('./router/userRouter')
const chatROute = require('./router/chatRoute')

const app = express();
app.use(cors());
app.use(bodyParser.json());

Users.hasMany(Message);
Message.belongsTo(Users)

Group.hasMany(Message)
Message.belongsTo(Group)

Users.belongsToMany(Group, { through: Groupmembers });
Group.belongsToMany(Users, { through: Groupmembers });


app.use('/user', userROute)

app.use('/logIn', chatROute)




sequelize
    .sync()
    //.sync({force:true}) // this is use to forcly delete all tables and creates new tables
    .then(result => {
        app.listen(3000)
    })
    .catch(err => console.log(err))
