var express = require('express');
var router = express.Router();

var AfkBot = require('../lib/afkbot');

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
// 545507d5da40e4032637d378
router.get('/:alarmId', function(req, res) {
  AfkBot.findAlarm(req.params.alarmId, function(err, alarm) {
    if (err || !alarm) { return new Error(err || 'no alarm found'); }
    else {
      if (alarm.armed) {
        // render view with buttons to turn home
        res.render('alarm', { alarm : alarm })
      }
      else {
        res.render('alarm', {
          alarm: alarm
        });
      }
    }
  });
});



module.exports = router;
