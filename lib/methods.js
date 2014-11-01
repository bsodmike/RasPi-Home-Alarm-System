var methods = require('./methods.js'),
    Alarm = require('./alarm.js'),
    AlarmLog = require('./alarmlog.js');

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

  createAlarmLog : function(alarm, logInfo, callback) {// pass in alarm to get the id to add to the alarmlog
    if (alarm) {
      logInfo = logInfo ? logInfo : 'no info given'

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


  shouldWeAlert : function(alarm, callback) {
    AlarmLog.find({ "alarmId" : alarm._id }, function(err, logs) {
        if (err) { return callback(new Error(err)) }
        else if (!logs) {
          return callback(null, true); // alert, as there's no previous log times to compare to
        }
        else {
          debugger
        }
    })

  },

}



// else {
//   return methods.createAlarmLog(alarm, 'motion detected', function(err, success) {
//     if (err || !success) { return callback(new Error(err)); }
//     else {
//       return callback(null, success)
//     }
//   })
// }
