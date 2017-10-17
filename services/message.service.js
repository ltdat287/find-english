const Messenger = require('../models/message');
const request = require('request');
const config = require('../configs/config');
const mongoose = require('mongoose');

module.exports = {
  // getFacebookData: getFacebookData,
  saveMessage: saveMessage
}

// Get user data Messenger Platform User Profile API and save it on the MongoDB
function saveMessage(userId, messageItem) {
  let question = messageItem.message.text
  let message = {
    user_id: mongoose.Types.ObjectId(userId),
    question: question,
    time_created: Date.now()
  }

  Messenger.create(message, function(err, doc) {
    if (err) console.log(err);
    else console.log('message saved');
  });


  // getFacebookData(facebookId, function(err, userData){
  //   let user = {
  //     fb_id: facebookId,
  //     first_name: userData.first_name,
  //     last_name: userData.last_name,
  //     profile_pic: userData.profile_pic,
  //     gender: userData.gender,
  //     locale: userData.locale,
  //     timezone: userData.timezone
  //   };

  //   User.collection.findOneAndUpdate({fb_id : facebookId}, user, {upsert:true}, function(err, user){
  //     if (err) console.log(err);
  //     else console.log('user saved');
  //   });
  // });
}

// Get User data from Messenger Platform User Profile API **NOT GRAPH API**
// function getFacebookData(facebookId, callback) {

//   request({
//     method: 'GET',
//     url: 'https://graph.facebook.com/v2.8/' + facebookId,
//     qs: {
//       fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
//       access_token: config.access_token
//     }
//   },

//   function(err, response, body) {

//     let userData = null
//     if (err) console.log(err);
//     else userData = JSON.parse(response.body);

//     callback(err, userData);
//   });
// }
