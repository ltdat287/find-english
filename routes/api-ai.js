const userService = require('../services/user.service');

module.exports = function(app) {
  // Index route
  app.get('/', function (req, res) {
    res.send('Welcome to the Index Route');
  });

  app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === WEBHOOK_TOKEN) {
      res.send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
    }
  });

  // API.AI webhook route
  app.post('/webhook/', function(req, res) {

    if (!req.body || !req.body.entry[0] || !req.body.entry[0].messaging) {
      return console.error("no entries on received body");
    }
    let messaging_events = req.body.entry[0].messaging;
    for (let messagingItem of messaging_events) {
      let user_id = messagingItem.sender.id;
      userService.saveUser(user_id, messagingItem);
    }

    // Your code for different actions sent by API.AI
    res.status(200).json('Sucessfull');
  });
}
