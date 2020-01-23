const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paypal = require("paypal-rest-sdk");

const { checkAuthenticated } = require('../auth/authCheck');
require('../models/User');
const User = mongoose.model('users');
let amount = undefined;
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ARWs9Re8oDbj_ItAT-FumtpHcYa9qyOJxfDdGowozLcQOC2ngMyhSFW1Kof7R9u7XqXMJbvuZl15aUQx',
  'client_secret': 'EC7bpldR_M1KzsHI9Nc1FqAxbHPssqSfiUsHF4-D0lP8RxzbXXCNEiAeQB_S9S7qo9EZ6zrB4gzbb5tH'
});

router.post("/pay", checkAuthenticated, (req, res) => {
  amount = req.body.amount;
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "https://doleout.herokuapp.com/paypal/success",
        "cancel_url": "https://doleout.herokuapp.com"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Doleout Wallet Credit",
                "sku": "001",
                "price": amount,
                "currency": "CAD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "CAD",
            "total": amount
        },
        "description": "You are paying to add credit to your DoleOut account."
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error);
      return res.redirect("/403");
    } else {
      console.log("Processing Payment for $" + amount);
        for (let i = 0; i < payment.links.length; i++){
          if (payment.links[i].rel === "approval_url"){
            res.send(payment.links[i].href);
            //res.redirect(payment.links[i].href)
            console.log("Found approval url");
            return;
          }
        }
    }
  });
  
});

router.get('/success', checkAuthenticated, (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  if (payerId === undefined || paymentId === undefined){
    return res.redirect("/403");
  }

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "CAD",
            "total": amount
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        res.redirect("/403");
    } else {
        // console.log(JSON.stringify(payment, null, 2));
        console.log(payment.transactions[0].amount.total);
        const formattedNum = Number(amount).toFixed(2);
        User.findOneAndUpdate({'_id': req.user._id}, 
        {$inc: {balance: formattedNum}}, 
        {useFindAndModify: false, new: true})
        .then( response => {
          console.log(response);
          res.redirect('/u/' + req.user._id);
        })
        .catch(err => {
          console.log("Couldnt update balance.");
          res.send("Could not update balance.");
        })
    }
  });
});

module.exports = router;