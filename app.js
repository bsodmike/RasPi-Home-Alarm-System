var dotenv = require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');

var Firebase = require('firebase'),
  moment = require('moment'),
  gpio = require("pi-gpio"),
  motionSensor = require("pi-pins").connect(18);

motionSensor.mode('in');

// user defined
var Alarm = require('./lib/alarm.js'),
    AlarmLog = require('./lib/alarmlog.js'),
    AfkBot = require('./lib/afkbot.js');


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var HouseLights = require('./lib/houselights.js');

var nightlight = {
  on: false,
  onAt: null
}

motionSensor.on('rise', function () {
  AfkBot.shouldAlert(function(err, response) {
    try {
      if (response === true) {
        AfkBot.alert(function(err, success) {
          if (err) { throw new Error(err) }
          else {
            AfkBot.createAlarmLog({ logType: 'motion' }, function(err, success) {
              if (err) { throw new Error(err) }
              else {
                console.log('alerted successfully: ' + new Date());
              }
            });
          }
        });
      }
      else if (nightlight.off) {
        nightlight.on = true;
        nightlight.onAt = new Date().toISOString();
        HouseLights.nightlight('on')
        console.log('nightlight on');
      }
    }
    catch (e) {
      if (e) { console.log(e); }
    }
  });
})


motionSensor.on('fall', function() {
  var nightlightInterval = moment().subtract(process.env.NIGHTLIGHT_INTERVAL, 'minutes')._d;
  if (nightlight.on && nightlightInterval > nightlight.onAt) {
    nightlight.on = false;
    nightlight.onAt = null;
    HouseLights.nightlight('off')
    console.log('nightlight off');
  }
});

module.exports = app;
