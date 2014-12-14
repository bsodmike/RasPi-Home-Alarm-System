var Pushover = require('node-pushover'),
    dotenv = require('dotenv').load(),
    gpio = require("pi-gpio"),
    motionSensor = require("pi-pins").connect(18).mode('in');

var push = new Pushover({
    token: process.env.PUSHOVER_TOKEN,
    user: process.env.PUSHOVER_USER_KEY
});

// motionSensor.mode('in');

motionSensor.on('rise', function () {
  push.send("Motion detected!");  
});