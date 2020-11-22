const express = require('express');
const moment = require('moment');
const momentz = require('moment-timezone');

const OutingFCMPush = require('./module/FWGnotification/OutingFCMPush');
const FWGlogs = require('./module/FWGlogs/app');
const lockerAPI = require('./module/locker/app_locker');
const receiptUploadAPI = require('./module/hractivity/savetheearth');

const app = express(); 

/////////////////////////// Port Listen //////////////

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "*");    
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
    

const PORT = process.env.PORT || 5624

app.listen(PORT);

///////////////////////////// Setting API ////////////////

var blank = require('./blank');

app.use('', blank);

///////////////////////////// Project API /////////////////

app.use('/api/locker', lockerAPI);

app.use('/api/receiptUpload', receiptUploadAPI);

//////////////////////////// Hr Activity API ////////////////

var save_the_earth = require('./module/hractivity/savetheearth');

app.use('/api/receiptUpload', save_the_earth);

var outing = require('./module/hractivity/outing');

app.use('/api/hr/activity/outing', outing);

//////////////////////////// Function Noti //////////////

OutingFCMPush.fcmCron();

//////////////////////////// Function CronJob //////////////


FWGlogs.SycDB.SycDeviceInfoDB();


//////////////////////////////////////////////////////////