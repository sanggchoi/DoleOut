const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {checkHexSanity} = require("./group");

//Load  Models
require('../models/Group');
const Group = mongoose.model('groups');
require('../models/User');
const User = mongoose.model('users');
require('../models/Message');
const Messages = mongoose.model('messages');

//Auth
const { checkAuthenticated, checkAuthenticated403, checkAdmin } = require('../auth/authCheck');

/**
 * Get all groups the user is in. Admins get all groups.
 */
router.get('/groups', checkAuthenticated403, (req, res) => {
  Group.find()
    .then(groups => {
      if (req.user.isAdmin){
        res.send(groups);
      } else {
        const filtered = groups.filter( g => g.memberIDs.includes(req.user._id));
        res.send(filtered)
      }
    })
    .catch(err => {
      console.log(err);
      res.redirect('./..');
    });
});

/**
 * Get all groups but the one in :group, that the user is in
 */
router.get('/groupsExcept/:group', checkAuthenticated403, (req, res) => {
  if (!checkHexSanity(req.params.group)){
    res.sendStatus(400);
    return;
  }
  Group.find()
    .then(groups => {
      const filtered = groups.filter( g => !g.deleted && String(g._id) !== req.params.group && g.memberIDs.includes(req.user._id));
      res.send(filtered);
    })
    .catch(err => {
      console.log(err);
      res.redirect('./..');
    });
});


/**
 * Get all members of a group :group
 */
router.get('/membersOf/:group', checkAuthenticated403, (req, res) => {
  if (!checkHexSanity(req.params.group)){
    res.sendStatus(400);
    return;
  }
  Group.findOne({'_id': mongoose.Types.ObjectId(req.params.group)})
  .then( group => {
    const membersList = group.memberIDs;
    if (!req.user.isAdmin && !membersList.includes(req.user._id)){
      throw new Error(`${req.user._id} is not a part of group members ${membersList}`);
    }
    promises = [];
    membersList.forEach(memberID => promises.push(User.findOne({'_id': mongoose.Types.ObjectId(memberID)})));
    return Promise.all(promises);
  })
  .then(values => {
    values.forEach( v => {
      v.password = undefined;
      v.balance = undefined;
    });
    res.send(values);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400);
  })
});

/**
 * Return logged in user
 */
router.get('/me', checkAuthenticated403, (req, res) => {
  req.user.password = undefined;
  res.send(req.user);
});

/**
 * Get the user with given ID
 */
router.get('/u/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        user.password = undefined;
        res.send(user);
      } else {
        throw new Error("no user")
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
})

/**
 * Get the user with given username
 */
router.get('/username/:name', (req, res) => {
  User.findOne({displayName: req.params.name})
    .then(user => {
      if (user) {
        user.password = undefined;
        user.balance = undefined;
        res.send(user);
      } else {
        throw new Error("no user")
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
})

/**
 * Get the group with given ID
 */
router.get('/g/:id', (req, res) => {
  Group.findById(req.params.id)
    .then(group => {
      if (group) {
        res.send(group)
      } else {
        throw new Error("no group")
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
})

/**
 * Check if a user exists. Send 200 if it does, 400 otherwise.
 */
router.get('/exists/:name', checkAuthenticated403, (req, res) => {
  User.find({ displayName: req.params.name })
    .then(user => {
      user = user[0]
      if (user) {
        res.sendStatus(200);
      } else {
        throw new Error("no user");
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
})

/**
 * Return ALL users
 */
router.get('/users', (req, res) => {
  User.find()
    .then(users => {
      users.forEach(u => {
        u.password = undefined;
        u.balance = undefined;
      });
      res.send(users)
    })
    .catch(err => {
      console.log(err);
      res.redirect('./..');
    });
});

/**
 * Returns all messages. should not actually be used, just for debugging
 */
router.get('/messages', checkAuthenticated403, checkAdmin, (req, res) => {
  Messages.find()
    .then(messages => {
      res.send(messages)
    })
    .catch(err => {
      console.log(err);
      res.redirect('./..');
    });
});

/**
 * Return the messages for group with groupid :group.
 */
router.get('/gm/:group', checkAuthenticated403, (req, res) => {
  let filtered = undefined;
  if (!checkHexSanity(req.params.group)){
    res.sendStatus(400);
    return;
  }
  Group.findById(req.params.group)
  .then(group => {
    if (group){
      if (req.user.isAdmin || group.memberIDs.includes(req.user._id)){
        return Messages.find({groupID: group._id})
      } else {
        throw new Error("current user is not in that group");
      }
    } else {
      throw new Error("null group");
      
    }
  })
  .then( messages => {
    filtered = messages.filter( m => !m.deleted);
    const promises = []
    filtered.forEach( message => promises.push(User.findOne({'_id': mongoose.Types.ObjectId(message.creatorID)})))
    return Promise.all(promises);
  })
  .then(values => {
    values.forEach(val => {
      val.password = undefined;
      val.balance = undefined;
      filtered = {[val._id]: val, ...filtered};
    });
    res.send(filtered);
  })
  .catch( err => {
    console.log(err);
    res.sendStatus(400);
  })
})



module.exports = router;