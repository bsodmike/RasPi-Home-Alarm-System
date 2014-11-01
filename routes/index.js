var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/:alarmId', function(req, res) {
  var alarm = req.params.alarmId;
  // find alarm and render view 
});



module.exports = router;
