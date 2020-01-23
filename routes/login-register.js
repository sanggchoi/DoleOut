const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const passport = require('passport');

//Load User Model
require('../models/User');
const User = mongoose.model('users');

//Auth
const { checkAuthenticated, checkGuest } = require('../auth/authCheck');

router.get('/login', checkGuest, (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../", 'public', 'index.html'))
});

router.get('/register', checkGuest, (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../", 'public', 'index.html'))
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/groups',
  failureRedirect: '/login',
  failureFlash: true
}));

// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', {session : false},
//   function(err, user, info) {
//       if (err) {
//           return res.sendStatus(500);
//       } else if (!user) {
//           return res.sendStatus(400);
//       }
//       req.logIn(user, function(err) {
//           if (err) {
//               return res.sendStatus(500);
//           }
//           res.redirect("/groups");
//       });
//   })(req, res, next);
// });

router.post('/register', (req, res) => {
  const newUser = new User({
    displayName: req.body["displayName"],
    password: req.body["password"],
    avatarURL: "https://api.adorable.io/avatars/200/default"
  });
  // console.log(JSON.stringify(req.body, null, 2));
  // console.log(req.body["displayName"]);
  //serverside check that a user with this username doesnt already exist
  User.findOne({displayName: req.body["displayName"]})
    .then(user => {
      if (user){
        console.log(`user ${req.body["displayName"]} already exists`);
        throw new Error("user already exists");
      } else {
        //Make the user and save it to DB
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => {
              console.log(`${newUser.displayName} is registered and can now login.`);
              res.sendStatus(200);
            })
            .catch(err => {
              console.log(err);
              return;
            });
          });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.get('/logout', checkAuthenticated, (req, res) => {
  console.log(`${req.user.displayName} has been logged out.`);
  req.logout();
  res.redirect("/");
});


module.exports = router;