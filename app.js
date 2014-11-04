var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var api = require('./routes/api');

var Firebase = require('firebase'),
    moment = require('moment');
    gpio = require("pi-gpio"),
    sensor = require("pi-pins").connect(18);

sensor.mode('in');

var  AfkBot = require('./lib/afkbot.js');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


sensor.on('rise', function () {
  // check if we're home or away
    // if away: check if we should alert
    // if so: alert and create log
  if (state == 'away') {
    AfkBot.shouldWeAlert(function(err, response) {
      try {
        if (response == true) {
          AfkBot.alert(function(err, success) {
            if (err) { throw new Error(err) }
            else {
              AfkBot.createAlarmLog(function(err, success) {
                if (err) { throw new Error(err) }
                else {
                  console.log('alerted successfully');
                }
              });
            }
          });
        }
        else { console.log('too soon to alert'); }
      }
      catch (e) {
        if (e) { console.log(e); }
      }
    });
  }
})


module.exports = app;
