// const mysql = require('mysql');
const sha256 = require('sha256');
const moment = require('moment');
const momentz = require('moment-timezone');
// var cron = require('node-cron');

////////////////////////////////////////////////////////

// const connection = mysql.createConnection({   
//     host     : 'freewillmdc.loginto.me', 
//     port     : '56860',
//     user     : 'fwghr',
//     password : 'fwg@mdc04111',
//     database : 'fwg_hr'
// });

/////////////////////////////////////////////////////////

// const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");
// const dateToday = moment().tz('Asia/Bangkok').format("YYYY-MM-DD");

///////////////////////////////////////////////////////

const middleware = (req, res, next) => {

    var chkmobile = sha256('@MDC');

    const token = req.headers.authorization;

    if(token  === chkmobile)
        next();
    else
        res.json("Access Denied")

}; 

////////////////////////////////////////////////////////

// const cronJob = () => { 

//     console.log("Start Cron");

//     cron.schedule('*/2 * * * *', function (a) { 
    
//         const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");

//         console.log("---------------------");
//         console.log('Running Cron Job '+time_at);
 
//     });

// };

////////////////////////////////////////////////////////

module.exports = {
    middleware
};

////////////////////////////////////////////////////////

// Mobile
// 6da58f9ce5a1e86bcd6c5e5f2a0157c18bbedbd06c90fffa8faefb1eb3dbe08c
