var moment = require('moment'),
    dotenv = require('dotenv').load(),
    Firebase = require('firebase'),
    Pushover = require('node-pushover'),
    AfkBot = require('./afkbot.js');

var alarmRootRef = new Firebase(process.env.FIREBASE_URL+'/alarms'),
    now = moment().format("dddd, MMMM Do YYYY, h:mm:ss a")

var push = new Pushover({
  token: process.env.PUSHOVER_TOKEN,
  user: process.env.PUSHOVER_USER_KEY
});

module.exports = {

  createAlarm : function(user, callback) {
    alarmRootRef.set({ armed : false, user : user }, function(err, success) {
      if (err) { return callback(new Error(err)) }
      else { callback(null, success) }
    });
  },

  createAlarmLog : function(callback) {
    var alarmRootRefUser = new Firebase(process.env.FIREBASE_URL+'/logs');
    alarmRootRefUser.set({ user : process.env.USERNAME, time : now, info : 'motion detected' }, function(err, success) {
      if (err) { return callback(new Error(err)) }
      else { return callback(null, 'success') }
    });
  },

  alert : function(callback) {
    push.send("Motion detected: " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), function(err, success) {
      if (err || !success) { return callback(new Error(err)) }
      else { return callback(null, true); }
    });
  },

  shouldWeAlert : function(callback) {
    var alarmRootRef = new Firebase(process.env.FIREBASE_URL);
    alarmRootRef.once('value', function(snap) {
      if (snap && snap.val() && snap.val().logs && snap.val().logs.time && snap.val().alarms.armed == (true || false) ) {
        if (snap.val().alarms.armed == true) {
          var lastDetected = moment(snap.val().logs.time)._d,
              twoMinutesAgo = moment().subtract(process.env.ALERT_INTERVAL, 'minutes')._d;
          if (lastDetected < twoMinutesAgo) {
            return callback(null, true)
          }
          else { return callback(null, false) }
        }
        else if (!snap.val().logs) { return callback(null, true) }
        else {
          return callback(null, false)
        }
      }
      else { return callback(null, false) }
    });
  },

  arm : function(callback) {
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
}
