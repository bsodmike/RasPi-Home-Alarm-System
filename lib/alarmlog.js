var mongoose = require('mongoose'),
    moment = require('moment');

var now = moment()._d;

var AlarmLogSchema = new mongoose.Schema({
  alarmId : { type : String },
  info : { type : String }, // ex: motion detected, alarm turned on/off
  time : { type : String, default : now }
});

var AlarmLog = mongoose.model('AlarmLog', AlarmLogSchema)


module.exports = AlarmLog
