const Messenger = require('../models/message');
const User = require('../models/user');
const request = require('request');
const config = require('../configs/config');
const mongoose = require('mongoose');
const templates = require('../views/templates');

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

            console.log(answerData);
            if (typeof answerData !== 'undefined' && answerData.ResultDataList.length) {
                answerData.ResultDataList.forEach(function(result, idx) {
                // only 3 reply
                if (idx < 2) {
                    let title = '';
                    let url_link = '';
                    let content = '';

                    snippet_lists = result.SnippetList;
                    for (let snippet of snippet_lists) {
                        let sources = snippet.SourceDomain
                        for (let source of sources) {
                            title = source.Domain;
                            let urls = source.Urls
                            for (let uri of urls) {
                                url_link = uri;
                            }
                        }

                        let contents = snippet.Content;
                        for (cont of contents) {
                            content += '- ' + cont + '\n';
                        }
                    }
                    
                    // Find user to get fb_id
                    User.findById(userId, function (err, res) {
                        if (err) {
                         console.log(err);   
                     } else {
                        let fb_id = res.fb_id;
                        sendAnswerResponse(fb_id, title, url_link, content)
                    }
                });
                }
            });
            }
        });

    });
}

function sendAnswerResponse(fb_id, title_btn, link_btn, content) {
    let template = templates.templates["answer"];

    if (title_btn) {
        template.attachment.payload.buttons[0].title = title_btn;
    }

    if (link_btn) {
        template.attachment.payload.buttons[0].url = link_btn;
    }

    if (content) {
        template.attachment.payload.text = content;
    }

    sendFacebookGenericMsg(fb_id, template)
}

// Send generic template msg (could be options, images, etc.)
function sendFacebookGenericMsg(fb_id, message_template) {
    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
        qs: {access_token: config.access_token},
        method: 'POST',
        json: {
            recipient: { id: fb_id },
            message: message_template
        }
    }, facebookCallbackResponse);
}

function facebookCallbackResponse(error, response) {
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
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

        return callback(err, answerData);
    });
}
