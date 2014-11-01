var express = require('express');
var router = express.Router();

var AfkBot = require('../lib/afkbot.js');

router.get('/:alarmId/arm', function(req, res) {
  AfkBot.findAlarm(req.params.alarmId, function(err, alarm) {
    if (err || !alarm) { res.send(400) }
    else {
      AfkBot.changeState(alarm, true, function(err, success) {
        if (err || !success) { res.send(400) }
        else {
          res.send(200)
        }
      });
    }
  });
});

router.get('/:alarmId/disarm', function(req, res) {
  AfkBot.findAlarm(req.params.alarmId, function(err, alarm) {
    if (err || !alarm) { res.send(400) }
    else {
      AfkBot.changeState(alarm, false, function(err, success) {
        if (err || !success) { res.send(400) }
        else {
          res.send(200)
        }
      });
    }
  });
});


module.exports = router;
