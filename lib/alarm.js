var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/alarm');

var AlarmSchema = new mongoose.Schema({
  armed : {
    type : Boolean,
    default : false
  },
  armed_at : {
    type : Date,
    default : null
  },
  disarmed_at : {
    type : Date,
    default : null
  },
});

var Alarm = mongoose.model('Alarm', AlarmSchema)


module.exports = Alarm
