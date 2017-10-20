'use strict'

var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
var key = process.env.KEY || '';
var cert = process.env.CERT || '';
var chain = process.env.CHAIN || '';

var mongoose = require('mongoose');
var database = require('./configs/database');

// Pull information from HTML POST (express4)
var bodyParser = require('body-parser');

// Mongoose connection
mongoose.connect(database[process.env.NODE_ENV || 'development'].url, function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("connected to " + database[process.env.NODE_ENV || 'development'].url);
});

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended': 'true'}));

// Parse application/json
app.use(bodyParser.json());

// Parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// Routes
require('./routes/api-ai.js')(app);

if (key) {
    // Listen (start app with node index.js)
    var options = {
        key: fs.readFileSync(key),
        cert: fs.readFileSync(cert),
        ca: fs.readFileSync(chain)
    };

    var server = https.createServer(options, app).listen(port, function () {
        console.log("Express server listening on port " + port);
    });
} else {
    app.listen(port);
}
