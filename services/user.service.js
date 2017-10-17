const User = require('../models/user');
const request = require('request');
const config = require('../configs/config');
const messageService = require('./message.service');

module.exports = {
  getFacebookData: getFacebookData,
  saveUser: saveUser
}

// Get user data Messenger Platform User Profile API and save it on the MongoDB
function saveUser(facebookId, messageItem) {

  getFacebookData(facebookId, function(err, userData){
    let user = {
      fb_id: facebookId,
      first_name: userData.first_name,
      last_name: userData.last_name,
      profile_pic: userData.profile_pic,
      gender: userData.gender,
      locale: userData.locale,
      timezone: userData.timezone
    };

    User.collection.findOneAndUpdate({fb_id : facebookId}, user, {upsert:true}, function(err, user){
      if (err) console.log(err);
      else console.log('user saved');
console.log(user, user.value._id);
      // Store message to database
      messageService.saveMessage(user.value._id, messageItem);
    });
  });
}

// Get User data from Messenger Platform User Profile API **NOT GRAPH API**
function getFacebookData(facebookId, callback) {

  request({
    method: 'GET',
    url: 'https://graph.facebook.com/v2.8/' + facebookId,
    qs: {
      fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
      access_token: config.access_token
    }
  },

  function(err, response, body) {

    let userData = null
    if (err) console.log(err);
    else userData = JSON.parse(response.body);

    callback(err, userData);
  });
}
