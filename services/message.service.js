const Messenger = require('../models/message');
const request = require('request');
const config = require('../configs/config');
const mongoose = require('mongoose');

module.exports = {
    findAnswerData: findAnswerData,
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

    Messenger.create(message, function (err, doc) {
        if (err) console.log(err);
        else console.log('message saved');

        let message_id = doc._id;
        console.log(message_id);

        findAnswerData(message_id, question, function (err, answerData) {
            let message = {
                "$set": {
                    "answer": JSON.stringify(answerData)
                }
            }

            Messenger.collection.findOneAndUpdate({_id: message_id}, message, {upsert: false}, function (err, mess) {
                if (err) console.log(err);
                else console.log('answer updated !');
            })
        });
    });
}

// Get Answer data from Ludwig Platform API **NOT GRAPH API**
function findAnswerData(message_id, question, callback) {

    let reqSearchQuestion = {
        method: 'GET',
        url: config.ludwig_uri,
        headers: {
            "Authorization": config.ludwig_authorization,
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36"
        },
        qs: {
            q: question
        }
    };

    request(reqSearchQuestion, function (err, response, body) {

        let answerData = null
        if (err) console.log(err);
        else answerData = JSON.parse(response.body);

        callback(err, answerData);
    });
}
