const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment');
var momentz = require('moment-timezone');
var multer  = require('multer');
// const readXlsxFile = require('read-excel-file/node');
const date = require('date-and-time');
const app = express();
var router = express.Router();
app.use(bodyParser.json())

const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");

var connection = mysql.createConnection({   
            host     : 'freewillmdc.loginto.me', 
            port     : '56860',
            user     : 'fwghr',
            password : 'fwg@mdc04111',
            database : 'fwg_hr'
});

connection.connect(function(err){
    if  (err){
        console.log(time_at+" ERR CONNECTION : "+err.stack);
        return;
    }else{
        console.log(time_at+" CONNECTION Outing ON :"+connection.threadId)
    }

});
///////////////////////////////////////////////////////

//Web API
router.get('',(req,res,result)=>{
    let msgConsole = time_at+" :";
    var sql = "select activity_name as activityName, description as description, DATE_FORMAT(date, '%Y-%m-%d') as date_start, TIME_FORMAT(time, '%H.%i') as time_start, DATE_FORMAT(date_end,'%Y-%m-%d') as date_end, TIME_FORMAT(time_end,'%H.%i') as time_end , images_url FROM activity WHERE id=8";
    connection.query(sql,function(err,rows,fields){
    
    if (!err){
    res.json({
     "HEAD": 200,
     "BODY": rows,
     "MESSAGE": "SUCCESS"
   });
     }else{
     res.json({
     "HEAD":502,
     "BODY":[],
     "MESSAGE": "FAILED"
   });
     }
    });
   });

////////////////////////////////////////////////////////

module.exports = router;