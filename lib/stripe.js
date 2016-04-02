var config = require ('../config');
var stripe = require ('../node_modules/stripe')(process.env.STRIPE_SECRET || config.stripe.secret || "sk_test_3pGKeJIsjhfcEUVAXinrNkVX");

exports.executePayment = function(token, amount, callback){
    stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: token,
      description: "Donation - Bobcat Racing"
    }, function(err, charge) {
      if (err) {
        console.error(err);
        callback(err);
      } else {
        callback();
      }
    });
};