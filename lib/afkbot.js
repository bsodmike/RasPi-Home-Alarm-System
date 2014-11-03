var moment = require('moment'),
    dotenv = require('dotenv').load(),
    Firebase = require('firebase'),
    Pushover = require('node-pushover'),
    AfkBot = require('./afkbot.js'),
    Alarm = require('./alarm.js'),
    AlarmLog = require('./alarmlog.js');

var alarmRootRef = new Firebase(process.env.FIREBASE_URL+'/alarms');

var push = new Pushover({
  token: process.env.PUSHOVER_TOKEN,
  user: process.env.PUSHOVER_USER_KEY
});

module.exports = {


  createAlarm : function(user, callback) {
    var alarmRootRefUser = new Firebase(process.env.FIREBASE_URL+'/alarms');

    alarmRootRefUser.set(new Alarm(user), function(err, success) {
      if (err) { return callback(new Error(err)) }
      else { callback(null, success) }
    })

  },

  createAlarmLog : function(callback) {
    var alarmRootRefUser = new Firebase(process.env.FIREBASE_URL+'/logs');

    alarmRootRefUser.set({ user : process.env.USERNAME, time : new Date().toISOString(), info : 'motion detected' }, function(err, success) {
      if (err) { return callback(new Error(err)) }
      else {
        console.log('alarm log created successfully');
        return callback(null, 'success')
      }
    })
  },

  alert : function(callback) {
    push.send("AFK Bot", 'Motion has been detected at: ' + moment()._d, function(err, success) {
      if (err || !success) { return callback(new Error(err)) }
      else {
        return callback(null, true);
      }
    });
  },

  shouldWeAlert : function(callback) {
    var alarmRootRef = new Firebase(process.env.FIREBASE_URL);
    alarmRootRef.once('value', function(snap) {
      if (snap && snap.val() && snap.val().logs && snap.val().logs.time) {

        var lastDetected = moment(snap.val().logs.time)._d,
            twoMinutesAgo = moment().subtract(process.env.ALERT_INTERVAL, 'minutes')._d;

        if (lastDetected < twoMinutesAgo) {
          return callback(null, true)
        }
        else {
          return callback(null, false)
        }
      }
      else if (!snap.val().logs) {
        return callback(null, true)
      }
    });
  },

  arm : function(callback) {
    var alarmRootRef = new Firebase(process.env.FIREBASE_URL+'/alarms');
    alarmRootRef.once('value', function(snap) {
      if (snap && snap.val()) {
        alarmRootRef.set({ armed : true , user : process.env.USERNAME }, function(err, success) {
          if (err) { return callback(new Error(err)) }
          else {
            return callback(null, 'armed')
          }
        });
      }
      else { return callback(new Error('no alarm')) }
    })
  },

  disarm : function(callback) {

    alarmRootRef.once('value', function(snap) {
      if (snap && snap.val()) {
        alarmRootRef.set({ armed : false , user : process.env.USERNAME }, function(err, success) {
          if (err) { return callback(new Error(err)) }
          else {
            return callback(null, snap.val())
          }
        });
      }
      else { return callback(new Error('no alarm')) }
    })
  },

  homeOrAway : function(callback) {
    alarmRootRef.once('value', function(snap) {
      if (snap && snap.val()) {
        if (snap.val().armed) {
          return callback(null, 'away')
        }
        else {
          return callback(null, 'home')
        }
      }
    });
  },

  // findAlarm : function(alarmId, callback) {
  //   Alarm.findOne({"_id" : alarmId}, function(err, alarm) {
  //     if (err || !alarm) { return callback(new Error(err)); }
  //     else { return callback(null, alarm) };
  //   });
  // },
  //
  //
  // arm : function(alarm, callback) {
  //   AfkBot.changeState(alarm, true, function(err, success) {
  //     if (err || !success) { return callback(new Error(err)); }
  //     else { return callback(null, success) }
  //   })
  // },
  //
  // disArm : function(alarm, callback) {
  //   AfkBot.changeState(alarm, false, function(err, success) {
  //     if (err || !success) { return callback(new Error(err)); }
  //     else { return callback(null, success) }
  //   })
  // },
  //
  // //  pass in a alarmState as true or false to arm/disarm
  // changeState : function(alarm, alarmState, callback) {
  //    AfkBot.findAlarm(alarm.id, function(err, alarm) {
  //     if (err || !alarm) { return callback(new Error(err)); }
  //     else {
  //       alarm.armed = alarmState;
  //       if (alarmState == true) {
  //         alarm.disarmedAt = null
  //         alarm.armedAt = new Date();
  //       }
  //       else if (!alarmState) {
  //         alarm.armedAt = null
  //         alarm.disarmedAt = new Date();
  //       }
  //       alarm.save(function(err, success) {
  //         if (err || !success) {
  //           return callback(new Error(err))
  //         }
  //         else {
  //           return callback(null, alarm)
  //         }
  //       });
  //     }
  //   });
  // },
  //
  // shouldWeAlert : function(alarm, callback) {
    // var twoMinutesAgo = moment().subtract(2, 'minutes');
  //   AlarmLog.find({ "alarmId" : alarm._id }, function(err, logs) {
  //     if (err) { return callback(new Error(err)) }
  //     else if (!logs) {
  //       console.log('no logs');
  //       return callback(null, true); // alert, as there's no previous log times to compare to
  //     }
  //     else {
  //       var lastLog = logs.pop();
  //       if (lastLog.time < twoMinutesAgo) {
  //         console.log('last log before two minutes ago');
  //         console.log(lastLog.time + '\n' + twoMinutesAgo);
  //         return callback(null, true)
  //       }
  //       else {
  //         console.log('we should not alert');
  //         return callback(null, false);
  //       }
  //     }
  //   })
  // },
  //


}
