var express = require('express');
var router = express.Router();

var AfkBot = require('../lib/afkbot');

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
