var moment = require('moment'),
    dotenv = require('dotenv').load(),
    Firebase = require('firebase'),
    Pushover = require('node-pushover'),
    Alarm = require('./alarm.js'),
    AlarmLog = require('./alarmlog.js');

var afkbot = new Alarm();

var alarmRef = new Firebase(process.env.FIREBASE_URL+'/alarm/'),
    alarmLogsRef= new Firebase(process.env.FIREBASE_URL+'/alarm/logs/'),
    alarmArmedRef = new Firebase(process.env.FIREBASE_URL+'/alarm/armed/');

var push = new Pushover({
  token: process.env.PUSHOVER_TOKEN,
  user: process.env.PUSHOVER_USER_KEY
});


function getState(callback) {
  alarmArmedRef.once('value', function(state) {
    state = state.val();
    afkbot.armed = state;
    return callback(null, afkbot.armed)
  });
}



// function initialize() {
//   alarmRef.once('value', function(state) {
//
//   });
// }();

module.exports = {

  createAlarm: function(callback) {
    alarmRef.set(afkbot, function(err, success) {
      if (err) { return callback(new Error(err)) }
      else { return callback(null, 'ok') }
    })
  },

  createAlarmLog: function(logOptions, callback) {
    alarmLogsRef.push(new AlarmLog(logOptions), function(err, success) {
      if (err) { return callback(new Error(err)) }
      else {
        return callback(null, 'ok')
      }
    })
  },

  // determines whether its time to alert
  shouldAlert: function(callback) {
    alarmArmedRef.once('value', function(state) {
      state = state.val();
      afkbot.armed = state;
      if (afkbot.armed === true) {
        alarmLogsRef.endAt().limit(200).on("value", function(alarmLogs) {
          var logs = []
          alarmLogs.forEach(function(log) {
            log = log.val();
            if (log.logType == 'motion') {
              logs.push(log);
            }
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
          else { return callback(null, true) }
        })
      }
      else {
        return callback(null, false);
      }
    });
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
  changeState: function(armed, callback) {
    var armed;
    // allow for home/away/true/false params for armed
    if (typeof armed !== 'undefined') {
      if (armed.toLowerCase() == 'home') {
        armed = false;
      }
      else if (armed.toLowerCase() === 'away') {
        armed = true;
      }
    }
    else {
      return callback(new Error('first parameter must be home/away/true/false'))
    }
    alarmRef.once('value', function(alarm) {
      if (alarm) {
        alarmRef.update({ armed: armed }, function(err, success) {
          if (err) { return callback(new Error(err)) }
          else {
            return callback(null, true);
          }
        });
      }
      else { return callback(new Error('no alarm')) }
    })
  },

  getState: function(callback) {
    alarmArmedRef.once('value', function(state) {
      state = state.val();
      afkbot.armed = state;
      return callback(null, afkbot.armed)
    });
  },

}
