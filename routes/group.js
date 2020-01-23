const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");

require('../models/User');
const User = mongoose.model('users');
require('../models/Message');
const Message = mongoose.model('messages');
require('../models/Group');
const Group = mongoose.model('groups');

const { checkAuthenticated } = require('../auth/authCheck');

/**
 * Getting a group with id :group.
 */
router.get('/:group', checkAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../", 'public', 'index.html'))
});

function checkHexSanity(id){
  const re = /[0-9a-f]{24}/g;
  return re.test(id);
}

/**
 * Updating (PATCH) a group (its name, could be color + icon too)
 */
router.patch('/:group', checkAuthenticated, (req, res) => {
  console.log(`Patching group with following body: ${req.body}`);
  Group.findOne({'_id': mongoose.Types.ObjectId(req.params.group)})
  .then( group => {
    if (group){
      if (req.user.isAdmin || group.superusers.includes(req.user._id)){
        Group.findOneAndUpdate({'_id': mongoose.Types.ObjectId(req.params.group)}, 
        {
          name: req.body.name,
          memberIDs: req.body.memberIDs,
        }, 
        {useFindAndModify: false})
        .then( response => res.sendStatus(200))
        .catch(err => {
          console.log(err);
          res.sendStatus(500);
        });
      } else {
        console.log("not authorized");
        res.sendStatus(403);
      }
    } else {
      console.log("that group DNE");
      res.sendStatus(400);
    }
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400);
  });
});

/**
 * Hiding (DELETE) a group
 */
router.delete('/:group', checkAuthenticated, (req, res) => {
  Group.findOne({'_id': mongoose.Types.ObjectId(req.params.group)})
  .then( group => {
    if (group){
      if (req.user.isAdmin || group.superusers.includes(req.user._id)){
        Group.findOneAndUpdate({'_id': mongoose.Types.ObjectId(req.params.group)}, 
        {
          deleted: true
        },
        {useFindAndModify: false})
        .then( response => {
          console.log(`deleted ${req.params.group}`)
          res.sendStatus(200);
        })
        .catch( err => {
          console.log("could not delete group:");
          console.log(err);
          res.sendStatus(500);
        })
      } else {
        console.log("not authorized");
        res.sendStatus(403);
      }
    } else {
      console.log("that group DNE.")
      res.sendStatus(400);
    }
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400);
  });
});

/**
 * Hiding (DELETE) a message in a group. User must be an admin, be a superuser of the group, or be the creator of the msg
 */
router.delete('/:group/msg/:msg', checkAuthenticated, (req, res) => {
  let foundGroup = undefined;
  Group.findOne({'_id': mongoose.Types.ObjectId(req.params.group)})
  .then( group => {
    if (group){
      foundGroup = group;
      return Message.findOne({'_id': mongoose.Types.ObjectId(req.params.msg), 'groupID': mongoose.Types.ObjectId(req.params.group)});
    } else {
      console.log("that group DNE.");
      res.sendStatus(400);
    }
  })
  .then( msg => {
    if (msg){
      if (req.user.isAdmin || String(msg.creatorID) === String(req.user._id) || foundGroup.superusers.includes(req.user._id)){
        Message.findOneAndUpdate({'_id': mongoose.Types.ObjectId(req.params.msg), 'groupID': mongoose.Types.ObjectId(req.params.group)},
        {
          deleted: true
        },
        {useFindAndModify: false})
        .then( response => {
          console.log(`deleted ${req.params.msg}`)
          res.sendStatus(200);
        })
        .catch( err => {
          console.log("could not delete msg");
          console.log(err);
          res.sendStatus(500);
        })
      } else {
        console.log("not authorized");
        res.sendStatus(403);
      }
    } else {
      console.log("that msg DNE.")
      res.sendStatus(400);
    }
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400);
  })
})

/**
 * Removing a user from a group
 */
router.delete('/:group/user/:user', checkAuthenticated, (req, res) => {
  let sentErr = false;
  Group.findOne({'_id': mongoose.Types.ObjectId(req.params.group)})
  .then( group => {
    if (group){
      if (req.user.isAdmin || group.superusers.includes(req.user._id)){
        return Group.findOneAndUpdate({'_id': mongoose.Types.ObjectId(req.params.group)}, 
        {
          memberIDs: group.memberIDs.filter(id => id !== req.params.user),
          superusers: group.superusers.filter(id => id !== req.params.user),
        },
        {useFindAndModify: false});
      } else {
        res.sendStatus(403);
        sentErr = true;
        throw new Error("forbidden 403");
      }
    } else {
      res.sendStatus(400);
      sentErr = true;
      throw new Error("that group DNE.");
    }
  })
  .then( response => {
    console.log(`Response: ${response}`);
    res.sendStatus(200);
  })
  .catch(err => {
    console.log(err);
    if (!sentErr){
      res.sendStatus(400);
    }
  })
});


/**
 * Adding a user to a group
 */
router.post('/:group/user/:user', checkAuthenticated, (req, res) => {
  //User is a name, not a id
  let userID = undefined;
  User.findOne({displayName: req.params.user})
  .then( user => {
    if (user){
      userID = user._id;
      return Group.findOne({'_id': mongoose.Types.ObjectId(req.params.group)});
    } else {
      throw new Error("no user with that ID");
    }
  })
  .then( group => {
    if (group){
      return Group.findOneAndUpdate({'_id': mongoose.Types.ObjectId(req.params.group)}, 
      {
        memberIDs: [...new Set(group.memberIDs.concat(userID))],
      },
      {useFindAndModify: false});
    } else {
      console.log("that group DNE.");
      res.sendStatus(400);
    }
  })
  .then( response => {
    console.log(`Response: ${response}`);
    res.sendStatus(200);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400);
  })
});

function expenseHasUser(expense, userID){
  const filtered = expense.members.filter( person => String(person._id) === String(userID));
  return filtered.length === 1;
}

/**
 * Paying an expense
 */
router.patch('/expense/:expense', checkAuthenticated, (req, res) => {
  User.findOne({'_id': mongoose.Types.ObjectId(req.user._id)})
  .then(user => {
    if (user.balance > req.body.amountPaid){
      return Message.findOne({'_id': mongoose.Types.ObjectId(req.params.expense)});
    } else {
      throw new Error("User is too poor to do this");
    }
  })
  .then( message => {
    if (message && !message.isMsg && expenseHasUser(message.expense, req.user._id)){
      return Message.findOneAndUpdate(
        {'_id': mongoose.Types.ObjectId(message._id)}, 
        {
          $inc: {'expense.totalRemaining': -req.body.amountPaid},
          $set: {'expense.totalPaid': req.body.totalPaid}
        },
        {useFindAndModify: false});
    } else {
      throw new Error(`message: ${message}, isexpense? ${!message.isMsg}, expenseHasUser ${expenseHasUser(message.expense, req.user._id)}`);
    }
  })
  .then( response => {
    console.log(`Response: ${response}`);
    // Updating invidual user stuff (amount paid, complete, totaltoPay)
    return Message.findOneAndUpdate(
      {'_id': mongoose.Types.ObjectId(req.params.expense), 'expense.members': {$elemMatch: {'_id': mongoose.Types.ObjectId(req.user._id)}}}, 
      {
        $inc: {'expense.members.$.amountPaid': req.body.amountPaid, 'expense.members.$.totalToPay': -req.body.amountPaid},
        $set: {'expense.members.$.complete': req.body.paidMyShare}
      },
      {useFindAndModify: false});
  })
  .then( response => {
    //Updating user balance
    return User.findOneAndUpdate(
      {'_id': mongoose.Types.ObjectId(req.user._id)}, 
      {
        $inc: {'balance': -req.body.amountPaid}
      },
      {useFindAndModify: false});
  })
  .then( response => {
    console.log(response);
    res.sendStatus(200);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400);
  })
});

/**
 * Making a new MESSAGE to a group with id :group.
 */
router.post('/:group', (req, res) => {
  //sanity check
  if (!checkHexSanity(req.params.group)){
    res.sendStatus(400);
  }
  //Check if req.user._id in group
  Group.findOne({'_id': mongoose.Types.ObjectId(req.params.group)})
  .then( group => {
    console.log(group)
    if (group){
      if (req.user.isAdmin || group.memberIDs.includes(req.user._id)){
        const newMsg = new Message({
          //This needs to be filled out properly a
          groupID: req.body.groupID,
          isMsg: req.body.isMsg,
          creatorID: req.body.creatorID,
          content: req.body.content,
          expense: req.body.expense,
        });
        newMsg.save()
        .then( result => {
          console.log("Saved new message");
          console.log(result);
          res.send(result);
        })
        .catch( err => {
          console.log("Could not save new message");
          console.log(err);
          res.sendStatus(500);
        })
      }
    } else {
      console.log("that group DNE.")
      res.sendStatus(400);
    }
  })
  .catch( err => {
    console.log(err);
  });
});

module.exports = { 
  group: router, 
  checkHexSanity: checkHexSanity ,
}