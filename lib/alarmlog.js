function AlarmLog(options) {
  this.time = new Date().toISOString();
  this.type = options.type; // home/away/motion
  this.user = options.user ? options.user : null; // user who armed or disarmed, null if motion.. not yet implemented.
}

module.exports = AlarmLog;
