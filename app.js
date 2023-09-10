const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const path = require('path')
// const http = require('http')


const sequelize = require('./utill/database');
const Users = require('./models/user')
const Group = require('./models/group')
const Message = require('./models/message')
const Groupmembers = require('./models/groupmemeber')
const userROute = require('./router/userRouter')
const chatROute = require('./router/chatRoute')

// const server = http.createServer(app);
const app = express();
const server = require("http").createServer(app);


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

// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req,res)=>{

//     res.sendFile(path.join(__dirname, `views/${req.url}`))
// })


// let server;

sequelize
    .sync()
    //.sync({force:true}) // this is use to forcly delete all tables and creates new tables
    .then(result => {
        server = app.listen(3000)
    })
    .catch(err => console.log(err))

const io = require("socket.io")(server, {
        // cors: {
        //   origin: ["http://127.0.0.1:5500"],
        // },
      });


// const io = require("socket.io")(server, {
//     // pingTimeout: 60000,
//     // cors: {
//     //     // origin:'*'
//     //     origin: "http://localhost:3000",
//     //     // "http://127.0.0.1:5500/",]
//     //     // credentials: true,
//     // },
// });

let numUsers = 0;

io.on('connection', (socket) => {
    console.log(socket.id)
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('new-user', (username) => {
    if (addedUser) return;
    
    // we store the username in the socket session for this client
    socket.username = username;
    console.log(socket.username)
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

// io.on('connection', socket => {
//     socket.on('new-user', name => {
//     //   users[socket.id] = name
//     console.log('name',+name)
//     //   socket.broadcast.emit('user-connected', name)
//     })
//     // socket.on('send-chat-message', message => {
//     //   socket.broadcast.emit('chat-message', { message: message })
//     // //   socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
//     // })
//     // socket.on('disconnect', () => {
//     //   socket.broadcast.emit('user-disconnected', users[socket.id])
//     //   delete users[socket.id]
//     // })
//   })