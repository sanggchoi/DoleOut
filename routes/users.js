const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require('../models/User');
const User = mongoose.model('users');

const { checkAuthenticated } = require('../auth/authCheck');

/**
 * Editing a user.
 */
router.patch('/:id', checkAuthenticated, (req, res) => {
  if (req.user.isAdmin || req.user._id == req.params.id){
    console.log(req.body);
    User.findOneAndUpdate({"_id": mongoose.Types.ObjectId(req.params.id)},
    {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      description: req.body.description,
      email: req.body.email,
      paypalURL: req.body.paypal,
      preference: req.body.pref,
      avatarURL: req.body.avatar
    },
    {useFindAndModify: false})
    .then( response => {
      console.log(`Response (old user): ${response}`)
      res.sendStatus(200);
    })
    .catch( err => {
      console.log(err);
    })
  }
})

module.exports = router;