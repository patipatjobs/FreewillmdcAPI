const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment');
var momentz = require('moment-timezone');
const app = express();
var router = express.Router();

////////////////////////// DB Setting ////////////////////////////////

var connection = mysql.createConnection({   
    host     : 'freewillmdc.loginto.me', 
    port     : '56860',
    user     : 'fwglocker',
    password : 'fwg@1234',
    database : 'fwg_locker_log'
});

const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");

connection.connect(function(err){
    if  (err){
        console.log(time_at+" ERR CONNECTION : "+err.stack);
        return;
    }else{
        console.log(time_at+" CONNECTION Locker ON :"+connection.threadId)
    }

});

////////////////////// Locker API //////////////////////////////////////
function mqtt(){
    var mqtt = require('mqtt'), url = require('url');
    // Parse
    var mqtt_url = url.parse(process.env.CLOUDAMQP_MQTT_URL || 'mqtt://mdc@freewill:mdc@123@hr.freewillsolutions.com:1883');
    var auth = (mqtt_url.auth || ':').split(':');
    var url = "mqtt://" + mqtt_url.host;

    var options = {
        port: mqtt_url.port,
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        username: auth[0],
        password: auth[1],
    };

    var client = mqtt.connect(url, options);

    client.on('connect', function(err) { // When connected
        // publish a message to a topic

        var msg = '{ "operation": "open"}';

        if(!err){
            console.log(msg);
        }else{
            console.log("Message Publish Error : "+err);  
        }

        client.publish('/FWG/locker1', msg, function(err) {
            if(!err){
                console.log(time_at+" Message is published");
            }else{
                console.log(time_at+" Message Publish Error : "+err);  
            }

            client.end(); // Close the connection when published

        });

        console.log(time_at+" Message Connect : "+err);  

    });
}

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json()

router.post('/abc', jsonParser,function (req,res){

    if(req.query.user != null ){
        var user = req.query.user;
    }else if(req.body.user != null ){
        var user = req.body.user;
    }else{
        var user = "Boo Boo";
    }

    var tt = "User : "+user;
    console.log(tt);

    res.json(tt);

});


router.post('',jsonParser,function (req,res){
    var user =  req.body.user;
    var locker_id =  req.body.locker_id;
    const created_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");
    // const updated_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");

    let msgConsole = created_at+" POST Locker Xform : ";
    const sql = "INSERT INTO locker_log (user,locker_id,created_at) VALUES (?,?,?)";
    connection.query(sql, [user,locker_id,created_at], function (err) {
        let sql = 'SELECT * FROM locker_log ORDER BY created_at desc Limit 5';  
        connection.query(sql,(err,rows) => { 
            if(!err){
                mqtt();
                res.json({ "HEAD": rows.length ,"BODY": rows ,"MESSAGE": "Add Success" });   
            }else{
                res.json(msgConsole+err);
                console.log(msgConsole+err);
            }
        });
        console.log(msgConsole+err);
    });

});

console.log("-------------------------------------------");

////////////////////////////////////////////
    
module.exports = router;