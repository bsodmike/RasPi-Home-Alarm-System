var moment = require('moment'),
    dotenv = require('dotenv').load(),
    Pushover = require('node-pushover'),
    AfkBot = require('./AfkBot.js'),
    Alarm = require('./alarm.js'),
    AlarmLog = require('./alarmlog.js');

var push = new Pushover({
  token: process.env.PUSHOVER_TOKEN,
  user: process.env.PUSHOVER_USER_KEY
});

module.exports = {

  createAlarm : function(callback) {
    var afkbot = new Alarm({});

    afkbot.save(function(err) {
      if (err) { return callback(new Error(err)) }
      else {
        return callback(null, afkbot)
      }
    });
  },

  createAlarmLog : function(alarm, logInfo, callback) {
    if (alarm) {
      logInfo = logInfo ? logInfo : 'no log info provided'

      var log = new AlarmLog({
        alarmId : alarm.id,
        info : logInfo
      });

      log.save(function(err) {
        if (err) throw (err)
        else {
          return callback(null, log)
        }
      });
    }
    else {
      return callback(new Error('No alarm provided. Please pass in an alarm and try again'))
    }
  },

  findAlarm : function(alarmId, callback) {
    Alarm.findOne({"_id" : alarmId}, function(err, alarm) {
      if (err || !alarm) { return callback(new Error(err)); }
      else { return callback(null, alarm) };
    });
  },


  arm : function(alarm, callback) {
    AfkBot.changeState(alarm, true, function(err, success) {
      if (err || !success) { return callback(new Error(err)); }
      else { return callback(null, success) }
    })
  },

  disArm : function(alarm, callback) {
    AfkBot.changeState(alarm, false, function(err, success) {
      if (err || !success) { return callback(new Error(err)); }
      else { return callback(null, success) }
    })
  },

  //  pass in a alarmState as true or false to arm/disarm
  changeState : function(alarm, alarmState, callback) {
     AfkBot.findAlarm(alarm.id, function(err, alarm) {
      if (err || !alarm) { return callback(new Error(err)); }
      else {
        alarm.armed = alarmState;
        if (alarmState == true) {
          alarm.disarmedAt = null
          alarm.armedAt = new Date();
        }
        else if (!alarmState) {
          alarm.armedAt = null
          alarm.disarmedAt = new Date();
        }
        alarm.save(function(err, success) {
          if (err || !success) {
            return callback(new Error(err))
          }
          else {
            return callback(null, alarm)
          }
        });
      }
    });
  },


  shouldWeAlert : function(alarm, callback) {
    var twoMinutesAgo = moment().subtract(2, 'minutes');
    AlarmLog.find({ "alarmId" : alarm._id }, function(err, logs) {
      if (err) { return callback(new Error(err)) }
      else if (!logs) {
        console.log('no logs');
        return callback(null, true); // alert, as there's no previous log times to compare to
      }
      else {
        var lastLog = logs.pop();
        if (lastLog.time < twoMinutesAgo) {
          console.log('last log before two minutes ago');
          console.log(lastLog.time + '\n' + twoMinutesAgo);
          return callback(null, true)
        }
        else {
          console.log('we should not alert');
          return callback(null, false);
        }
      }
    })

  },

  alert : function(alarm, callback) {
    push.send("AFK Bot", 'Motion has been detected at: ' + moment.now()._d, function(err, success) {
      if (err || !success) { return callback(new Error(err)) }
      else {
        AfkBot.createAlarmLog(alarm, 'motion detected', function(err, success) {
          if (err || !success) { return callback(new Error(err)) }
          else {
            return callback(null, true);
          }
        });
      }
    });
  },

}
