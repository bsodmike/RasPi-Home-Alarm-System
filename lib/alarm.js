function Alarm() {
  this.armed = false;
}

Alarm.prototype = {
  changeState: function(state) {
    this.armed = state == 'arm' ? true : false
  },
  arm: function() {
    this.armed = true;
  },
  disarm: function() {
    this.armed = false;
  }
}


module.exports = Alarm;
