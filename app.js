var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Firebase = require('firebase'),
    moment = require('moment');

var routes = require('./routes/index');
var api = require('./routes/api');

var Alarm = require('./lib/alarm.js'),
    AlarmLog = require('./lib/alarmlog.js'),
    AfkBot = require('./lib/afkbot.js');



// AfkBot.createAlarmLog(process.env.USERNAME, 'motion detected', function(err, success) {
//   if (err) { throw new Error(err) }
//   else { console.log('alarm log created successfully'); }
// });

// AfkBot.createAlarm(process.env.USERNAME, function(err, success) {
//   if (err) { throw new Error(err) }
//   else { console.log('log created successfully'); }
// });



var gpio = require("pi-gpio");

var sensor = require("pi-pins").connect(18);
  sensor.mode('in');


sensor.on('rise', function () {
  AfkBot.shouldWeAlert(function(err, response) {
    try {
      if (response == true) {
        AfkBot.alert(process.env.USERNAME, function(err, success) {
          if (err) { throw new Error(err) }
        });
      }
      else { console.log('too soon'); }
    }
    catch (e) {
      if (e) { console.log(e); }
    }
  });

})




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
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

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
