var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').load();

var AfkBot = require('../lib/afkbot.js');

router.get('/arm', function(req, res) {
  if (req.query.passcode && req.query.passcode == process.env.ALARM_PASSCODE) {
    AfkBot.changeState('away', function(err, success) {
      if (err) { res.status(500).end() }
      else {
        AfkBot.createAlarmLog({ logType: 'arm' }, function(err, success) {
          if (err) { res.status(500).end() }
          else {
            res.status(200).end();
          }
        });
      }
    })
  }
  else { res.status(500).end() }
});

router.get('/disarm', function(req, res) {
  if (req.query.passcode && req.query.passcode == process.env.ALARM_PASSCODE) {
    AfkBot.changeState('home', function(err, success) {
      if (err) { res.status(500).end() }
      else {
        AfkBot.createAlarmLog({ logType: 'disarm' }, function(err, success) {
          if (err) { res.status(500).end() }
          else {
            res.status(200).end();
          }
        });
      }
    })
  }
  else { res.status(500).end() }
});

router.get('/state', function(req, res) {
  if (req.query.passcode && req.query.passcode == process.env.ALARM_PASSCODE) {
    AfkBot.getState(function(err, armed) {
      if (err) { res.send(500) }
      else {
        state = armed == false ? 'home' : 'away'
        res.json({ state: state });
      }
    })
  }
  else { res.status(500).end(); }
});


module.exports = router;
