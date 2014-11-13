var moment = require('moment'),
    dotenv = require('dotenv').load(),
    Firebase = require('firebase'),
    Pushover = require('node-pushover'),
    Alarm = require('./alarm.js'),
    AlarmLog = require('./alarmlog.js');

var afkbot = new Alarm();

var alarmRef = new Firebase(process.env.FIREBASE_URL+'/alarm/'),
    alarmLogsRef= new Firebase(process.env.FIREBASE_URL+'/alarm/logs/');

var push = new Pushover({
  token: process.env.PUSHOVER_TOKEN,
  user: process.env.PUSHOVER_USER_KEY
});


// function initialize() {
//  // ensure an alarm and log are created
// }();

module.exports = {

  createAlarm: function(callback) {
    alarmRef.set(afkbot, function(err, success) {
      if (err) { return callback(new Error(err)) }
      else { return callback(null, 'ok') }
    })
  },

  createAlarmLog: function(options, callback) {
    alarmLogsRef.push(new AlarmLog(options), function(err, success) {
      if (err) { return callback(new Error(err)) }
      else {
        return callback(null, 'ok')
      }
    })
  },

  // determines whether its time to alert
  shouldAlert: function(callback) {
    alarmLogsRef.endAt().limit(50).on("value", function(alarmLogs) {
      var logs = []
      alarmLogs.forEach(function(log) {
        if (log) {
          log = log.val();
          if (log.type == 'motion') {
            logs.push(log);
          }
        }
        else {
          return callback(null, null) } // alert
      })

      // grab the last log and see if its before ALERT_INTERVAL minutes
      if (logs.length > 0) {
        var lastAlerted = moment(logs.pop().time)._d,
            alertIntervalTimeAgo = moment().subtract(process.env.ALERT_INTERVAL, 'minutes')._d;
        if (alertIntervalTimeAgo > lastAlerted) {
          return callback(null, true)
        }
        else {
          return callback(null, false);
        }
      }
      else { return callback('oops something went wrong #222') }
    })
  },

  alert: function(callback) {
    push.send("Motion detected", '\n' + moment(new Date())._d, function(err, success) {
      if (err) { return callback(new Error(err)) }
      else {
        return callback(null, 'success');
      }
    });
  },

  // arm or disarm
  changeState: function(options, callback) {
    var AfkBot = require('./afkbot');
    afkbot.armed = options.type == 'arm' ? true : false
    console.log("afkbot armed: " + afkbot.armed);
    alarmRef.once('value', function(alarm) {
      if (alarm) {
        alarmRef.update(afkbot, function(err, success) {
          if (err) { return callback(new Error(err)) }
          else {
            AfkBot.createAlarmLog(options, function(err, success) {
              if (err) { return callback(new Error(err)) }
              else {
                return callback(null, success)
              }
            });
          }
        });
      }
      else { return callback(new Error('no alarm')) }
    })
  },
}
