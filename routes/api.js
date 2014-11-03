var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').load();

var AfkBot = require('../lib/afkbot.js');

router.get('/arm', function(req, res) {
  if (req.query.passcode) {
    if (req.query.passcode == process.env.ALARM_PASSCODE) {
      AfkBot.arm(function(err, success) {
        if (err) { res.send(500) }
        else {
          res.render('alarm', { state: 'home' })
        }
      })
    }
    else {
      res.send(504)
    }
  }
  else {
    res.send(504)
  }
});


router.get('/disarm', function(req, res) {
  if (req.query.passcode) {
    if (req.query.passcode == process.env.ALARM_PASSCODE) {
      AfkBot.disarm(function(err, success) {
        if (err) { res.send(500) }
        else {
          res.render('alarm', { state: 'home' })
        }
      })
    }
    else {
      res.send(504)
    }
  }
  else {
    res.send(504)
  }
});

module.exports = router;
