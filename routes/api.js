var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').load();

var AfkBot = require('../lib/afkbot.js');

router.get('/arm', function(req, res) {
  if (req.query.passcode && (String(req.query.passcode) == String(process.env.ALARM_PASSCODE)) ) {
    AfkBot.arm(function(err, success) {
      if (err) { res.send(500) }
      else {
        res.render('alarm', { state: 'away' })
      }
    })
  }
});

router.get('/disarm', function(req, res) {
  if (req.query.passcode && (String(req.query.passcode) == String(process.env.ALARM_PASSCODE)) ) {
    AfkBot.disarm(function(err, success) {
      if (err) { res.send(500) }
      else {
        res.render('alarm', { state: 'home' })
      }
    })
  }
});

module.exports = router;
