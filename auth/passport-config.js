const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

//Load User Model
require('../models/User');
const User = mongoose.model('users');

function getUserByUsername(username) {
  console.log(`LOGIN: Trying to log in username: ${username}`);
  return User.findOne({displayName: username}).exec()
  .then( user => {
    console.log(`LOGIN: Found User in DB with display name: ${user.displayName}`)
    if (user !== null){
      console.log("LOGIN: Returning found user...")
      return user;
    } else {
      return null;
    }
  })
  .catch(err => {
    console.log(err)
  })
}

function getUserById(id){
  return User.findById(id, (err, user) => {
    if (err) throw err;
    if (user){
      return user;
    } else {
      return null;
    }
  });
}

function initialize(passport){
  const authenticateUser = async (username, password, done) => {
    const user = await getUserByUsername(username);
    if (user == null){
      console.log("no user")
      return done(null, false, { message: "no user found for that username" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log("LOGIN: User and password match - Successful login.");
        return done(null, user)
      } else {
        console.log("LOGIN: Password doesnt match")
        return done(null, false, {message: "password did not match"})
      }
    } catch (error) {
      return done(error);
    }
  }
  passport.use(new LocalStrategy( {
    usernameField: 'username'
  }, authenticateUser ));
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser( async (id, done) => {
    const user = await getUserById(id);
    return done(null, user);
  });
}

module.exports = initialize;