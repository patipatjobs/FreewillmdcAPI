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
router.post('',(req,res,result)=> {
    
    let msgConsole = time_at+" Text Err  : ";

    var sql = "INSERT INTO abc (text) VALUES (?)";

    var text = req.query.text;
    
    connection.query(sql,[text], function (err, rows, fields) {
        
        if(!err){


            
            res.json({ "Text Err": text , })  
            console.log(msgConsole+err);
        
        }else{
            res.json(msgConsole+err)
            console.log(msgConsole+err);
        }   

	});
	

});

////////////////////////////////////////////////////////

module.exports = router;