var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/alarm');
var AlarmSchema = new mongoose.Schema({
  armed : {
    type : Boolean,
    default : false
  },
  armedAt : {
    type : Date,
    default : null
  },
  disarmedAt : {
    type : Date,
    default : null
  },
});

var Alarm = mongoose.model('Alarm', AlarmSchema);


module.exports = Alarm
