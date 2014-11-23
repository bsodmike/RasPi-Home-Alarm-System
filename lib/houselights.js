var Hue = require('hue.js');

var houseLights = Hue.createClient({
  stationIp:process.env.HUE_BRIDGE_IP, // 'x.x.x.x', retrieved from the previous step
  appName:process.env.HUE_APP_NAME // Any alpha numeric name for your app
});


function letThereBeLight(light) {
  var options = { "on":true, "sat":255, "bri":255,"hue":10000 }
  houseLights.on(light, options, function(err, success) {
    if (err) { throw new Error(err) }
  })
}

function hitTheLights(light) {
  var options = { "on":false, "sat":255, "bri":255,"hue":10000 }
  houseLights.state(light, options, function(err, success) {
    if (err) { throw new Error(err) }
  })
}

function nightLight(lightNumber) {
  options = {"on":true, "sat":253, "bri":10,"hue":48003 }
  houseLights.state(lightNumber, options, function(err, light) {
    letThereBeLight(lightNumber);
  });
}


module.exports = {

  hitTheLights : function() {
    for (var i = 1; i < process.env.HUE_LIGHT_COUNT+1; i += 1) { hitTheLights(i) }
  },

  letThereBeLight : function() {
    for (var i = 1; i < process.env.HUE_LIGHT_COUNT+1; i += 1) { letThereBeLight(i) }
  },

  nightLight : function() {
    for (var i = 1; i < process.env.HUE_LIGHT_COUNT+1; i += 1) { nightLight(i) }
  },

}


// houseLights.lights(function(err,lights) {
//   if (err && err.type === 1) {
//     // App has not been registered
//
//     console.log("Please go and press the link button on your base station(s)");
//     houseLights.register(function(err) {
//
//       if (err) {
//         // Could not register
//       } else {
//
//       }
//     });
//   } else {
//     console.log(lights);
//   }
// });
