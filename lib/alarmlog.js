var mongoose = require('mongoose');

var AlarmLogSchema = new mongoose.Schema({
  alarmId : { type : String },
  info : { type : String }, // ex: motion detected, alarm turned on/off
  time : { type : Date, default : new Date() }
});

var AlarmLog = mongoose.model('AlarmLog', AlarmLogSchema)


module.exports = AlarmLog
