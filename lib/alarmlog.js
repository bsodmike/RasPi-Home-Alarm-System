function AlarmLog(user, info) {
  this.log = {
    time : new Date().toISOString(),
    info : info ? info : 'no information given',
    user : user,
  }
}



module.exports = AlarmLog;
