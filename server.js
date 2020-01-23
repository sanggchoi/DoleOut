/*
TODO

When a user makes their first group, the "ur not in any groups" message still shows up.

When you fail to register or login, it should tell you why after redirected.

New user should be sent to their profile to be edited

Autocomplete Material UI dropdown for choosing users and stuff

Users can make payments even if they have no money
*/

//Bring in our dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server);

//Require our routes
const login_register = require('./routes/login-register');
const groups = require('./routes/groups');
const { group } = require('./routes/group');
const users = require('./routes/users');
const api = require('./routes/api');
const paypalRoute = require('./routes/paypal');

//Mongoose connection
mongoose.promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch( err => console.log(`Error: ${err}`));
require('./models/User');
const User = mongoose.model('users');
require('./models/Group');
const Group = mongoose.model('groups');

//Passport Authentication
const initializePassport = require('./auth/passport-config');
initializePassport(passport);

const { checkAuthenticated, checkAdmin } = require("./auth/authCheck");

//To allow posting to express server (port 5000) via react server (port 3000)
app.use(cors());
app.use(function (req, res, next) {
  //Enabling CORS
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});

//To allow us to use the react app
app.use(express.static('public'));

//Body parser to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

//Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

//Use our routes
app.use('/', login_register);
app.use('/', groups);
app.use('/u', users);
app.use('/g', group);
app.use('/api', api);
app.use('/paypal', paypalRoute);
app.get('/go/:name', (req, res) => {
  User.findOne({displayName: req.params.name})
  .then( user => {
    res.redirect(`/u/${user._id}`);
  })
  .catch( err => {
    console.log(`Error: Trying to FIND via GO user. ${err}`)
  })
})

connections = {};

app.get("/connections", checkAuthenticated, checkAdmin, (req, res) => {
  res.header("Content-Type",'application/json');
  res.send(JSON.stringify(connections, null, 4));
});

// If we do not hit any of the above paths, then go to index in the public folder (react app)
app.get('*', (req, res) =>{
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

//Run the server
server.listen(PORT, () => console.log(`Express Server started on port ${PORT}`));

io.on("connection", socket => {
  let currentRoomId;
  socket.on("new-user", userAndGroup => {
    connections[socket.id] = userAndGroup;
    if (userAndGroup.group !== undefined){
      socket.to(userAndGroup.group._id).broadcast.emit("user-joined", userAndGroup.user);
    }
  });

  socket.on("create", (room) => {
    socket.join(room);
    currentRoomId = room;
  });

  socket.on("delete-msg", msgAndUser => {
    socket.to(msgAndUser.message.groupID).broadcast.emit("chat-message-delete", msgAndUser);
  });

  socket.on("send-chat-message",  msgWithUserObj => {
    socket.to(msgWithUserObj.message.groupID).broadcast.emit('chat-message', msgWithUserObj);
  });

  socket.on("disconnect", () => {
    if (connections[socket.id] !== undefined){
      socket.to(currentRoomId).broadcast.emit("user-disconnected", connections[socket.id].user.displayName);
    }
    delete connections[socket.id];
    
  });
});

