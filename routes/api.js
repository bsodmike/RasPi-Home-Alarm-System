var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').load();

var AfkBot = require('../lib/afkbot.js');

router.get('/arm', function(req, res) {
  if (req.query.passcode && req.query.passcode == process.env.ALARM_PASSCODE ) {
    AfkBot.arm(function(err, success) {
      if (err) { res.send(500) }
      else {
        res.render('alarm', { state: 'away' })
      }
    })
  }
  else { res.send(500) }
});

router.get('/disarm', function(req, res) {
  if (req.query.passcode && req.query.passcode == process.env.ALARM_PASSCODE) ) {
    AfkBot.disarm(function(err, success) {
      if (err) { res.send(500) }
      else {
        res.render('alarm', { state: 'home' })
      }
    })
  }
  else { res.send(500) }
});

module.exports = router;
