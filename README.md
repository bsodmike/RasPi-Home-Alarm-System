RasPi-Home-Alarm-System
=======================

Monitor your home while your away with RaspberryPi and a $10 PIR Motion sensor 

Create your alarm
==== 
AfkBot.createAlarm('kevin', function (err, success) {
  if (err) { throw new Error(err) }
  else { console.log('alarm created successfully'); }
})

Create some logs
====
AfkBot.createAlarmLog('kevin', 'motion detected', function(err, success) {
  if (err) { throw new Error(err) }
  else { console.log('alarm log created successfully'); }
});
