var Hue = require('hue.js'),
    Firebase = require('firebase');

var houseLights = Hue.createClient({
  stationIp:process.env.HUE_BRIDGE_IP,
  appName:process.env.HUE_APP_NAME
});


function letThereBeLight(light) {
  var options = { "on":true, "sat":255, "bri":255,"hue":10000 }
  houseLights.on(light, options, function(err, success) {
    if (err) {
      if (err.type == 201) { console.log(err.description) } // device off
      else { throw new Error(err) }
    }
  })
}

function hitTheLights(light) {
  var options = { "on":false, "sat":255, "bri":255,"hue":10000 }
  houseLights.state(light, options, function(err, success) {
    if (err) {
      if (err.type == 201) { console.log(err.description) } // device off
      else { throw new Error(err) }
    }
  })
}

function nightlight(lightNumber, lightState) {
  var options = {"sat":253, "bri":10,"hue":48003 }
  houseLights.state(lightNumber, options, function(err, light) {
    if (lightState.toLowerCase() == 'on') {
       letThereBeLight(lightNumber)
    } else {
      hitTheLights(lightNumber)
    }
  });
}


module.exports = {

  hitTheLights : function() {
    for (var i = 1; i < Number(process.env.HUE_LIGHT_COUNT)+1; i += 1) { hitTheLights(i) }
  },

  letThereBeLight : function() {
    for (var i = 1; i < Number(process.env.HUE_LIGHT_COUNT)+1; i += 1) { letThereBeLight(i) }
  },

  nightlight : function(lightState) {
    return nightlight(process.env.HUE_NIGHTLIGHT_LIGHT, lightState)
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
