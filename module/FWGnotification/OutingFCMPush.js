const express = require('express');
const mysql = require('mysql');
const app = express(); 
var FCM = require('fcm-node');
var cron = require('node-cron');
const moment = require('moment');
const momentz = require('moment-timezone');
var fs = require('fs');

var host = 'freewillmdc.loginto.me';
var port = '56860';

const connectionHR = mysql.createConnection({   
    host     : host,
    port     : port,
    user     : '_____',
    password : '_____',
    database : '_____'
});

const connectionHRServices = mysql.createConnection({   
    host     : '52.163.82.249',
    port     : '1178',
    user     : '____',
    password : '____',
    database : '____'
});

var RowsData;
var marr;
var subnoti;
var emp;

const fcmCron = () => {

    const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");

    console.log(time_at+' Start Cron Job Outing ');

    // var ctime = '00,05,10,15,20,25,30,35,40,45,50,55 * * * *';

    var ctime = '*/1 * * * *';

    cron.schedule(ctime, function () { 

        const dateT = moment().tz('Asia/Bangkok').format("YYYY-MM-DD");
        const timeT = moment().tz('Asia/Bangkok').format("HH:mm:ss");
        const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");

        var sqlA = "SELECT * FROM activity WHERE activity_name = 'NotiOuting' AND date ='"+dateT+"' AND time ='"+timeT+"'";

        connectionHR.query(sqlA, (err, rows) => {
 
            RowsData = rows;
            
            if(rows.length>0){

                var shortName = rows[0].short_name;
                var descriptionName = rows[0].description;   

                if(shortName === 'outing_bus'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token, empd.created_date FROM employee_device_info as empd  inner join employee_activity as empa on empa.employee_id = empd.employee_id WHERE empa.bus NOT IN ('-','Car') AND empd.active = '1' GROUP BY empd.employee_id ORDER BY empd.created_date DESC";
                }else if(shortName === 'outing_sport1'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token, empd.created_date FROM employee_device_info as empd  inner join employee_activity as empa on empa.employee_id = empd.employee_id WHERE empa.bus NOT IN ('-') AND empa.theme_park NOT IN ('ไม่เข้าร่วม') AND empd.active = '1' GROUP BY empd.employee_id ORDER BY empd.created_date DESC";
                }else if(shortName === 'outing_sport2'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token, empd.created_date FROM employee_device_info as empd  inner join employee_activity as empa on empa.employee_id = empd.employee_id WHERE empa.bus NOT IN ('-') AND empa.water_park NOT IN ('ไม่เข้าร่วม') AND empd.active = '1' GROUP BY empd.employee_id ORDER BY empd.created_date DESC";
                }else if(shortName === 'outing_party'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token, empd.created_date FROM employee_device_info as empd  inner join employee_activity as empa on empa.employee_id = empd.employee_id WHERE empa.bus NOT IN ('-') AND empa.party NOT IN ('No') AND empd.active = '1' GROUP BY empd.employee_id ORDER BY empd.created_date DESC";
                }else if(shortName === 'outing_buddy'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token, empd.created_date FROM employee_device_info as empd  inner join employee_activity as empa on empa.employee_id = empd.employee_id WHERE empa.bus NOT IN ('-') AND empa.buddy NOT IN ('ไม่ระบุ') AND empd.active = '1' GROUP BY empd.employee_id ORDER BY empd.created_date DESC";
                }else if(shortName === 'outing_lunch1'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token, empd.created_date FROM employee_device_info as empd  inner join employee_activity as empa on empa.employee_id = empd.employee_id WHERE empa.bus NOT IN ('-') AND empa.lunch1 IN ('Yes') AND empd.active = '1' GROUP BY empd.employee_id ORDER BY empd.created_date DESC";
                }else if(shortName === 'outing_lunch2'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token, empd.created_date FROM employee_device_info as empd  inner join employee_activity as empa on empa.employee_id = empd.employee_id WHERE empa.bus NOT IN ('-') AND empa.lunch2 IN ('Yes') AND empd.active = '1' GROUP BY empd.employee_id ORDER BY empd.created_date DESC";
                }else if(shortName === 'mdctest'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token,empd.created_date FROM employee_device_info as empd  WHERE empd.employee_id IN (SELECT employee_id FROM employee WHERE unit = 'Mobile Development Center') ORDER BY empd.created_date DESC";
                }else if(shortName === 'hrtest'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token,empd.created_date FROM employee_device_info as empd  WHERE empd.employee_id IN ('1917','2257','1954','2305') ORDER BY empd.created_date DESC";              
                }else if(shortName === 'soso'){
                    var sqlB = "SELECT DISTINCT empd.employee_id ,empd.device_token,empd.created_date FROM employee_device_info as empd  WHERE empd.employee_id IN ('2257') ORDER BY empd.created_date DESC";              
                }
                connectionHR.query(sqlB, (err, rows) => {

                    if(rows.length>0){ 

                        // console.log(rows); 

                        emp =[];

                        for (var i in rows){

                            emp.push(rows[i].device_token);  

                        }
                        
                            marrOonjai = [
                                    // Soso
                                    'c97KseUNa_s:APA91bGqERwmnm1QrYn5g3Q_msrFt9jpcy-gsx3W2rxEkc1vNtPfVuSIahW29QIiEmH7sEjBZW87hwld0zjP_vlo9mDubeQ_spwmcBhbdUSTA5KtaHWloJLoWow5rv7ZEx7-WeE1f8d8',
                                    // Ed                   
                                    'cKYI9_dbtLs:APA91bEJm1u6m5PiaLE9FeiNKYEg3-YMeCkJI-i4D5Hu418oxCBTMlHUDRK62vhFSvyBvK-5Vsz2QaZlzeomlJWLtazbWT-t9myVXfHIDrJHhwFZ1M15wI_crPQP7uFYuw9JhlKcyvNo',
                            ];
                            marrPrompt = [   
                                // Soso     
                                'eAeH9aAfWlY:APA91bGUaAS8xC455e9jOC_zTj2PR_QxYyDu_yllec7k6z25kVHX9YSbikm8p-sTg7fme1Sv8ZEHGgpvKpiROWD9Fuo8N-LVavt_Gc1KeNmni2D48kO7k-6EAoB68NozFAi0c5T9jgMW',
                                // Toro
                                'cj0grE5dTxw:APA91bFg7wGCtYQw8Cw2NWXDZHk5E6-PAXmY6QL3iwPp9LTiyB2v5ED0BFF1OMTQsHfbYQzh5UrMfqJLU2QCaVitNnzK_rq1-PLH4Yd9QIjfTrb1TtTk3gz2OE7jb7uwTV7F6L89lwQM',
                                // P'Pla
                                'fi6a-eL-yFE:APA91bFvZ-HBcQSgZvouH3BaSPfHAk0HVXPhuHKqzluchT9f6jMLMaOWl4lO93TsBcnWw5yp2P98RgtIjlesKjNY96Deq6Jl00zApYccG-CcxiDWKn0sl-wJnws7o921dqtmwTZFG-Uh',
                                // Ed
                                'fcnp3POi5Tg:APA91bELC1diYtxBQ32ug_ulzafhm9uxeXxnflMx42RcZ8VfIQYk4kTS2ENghKDkkZXtNlBTgNjV0-M-uaV1d8DSYkIzNyq1lSpHNtmDuCq5ZlI2u_3tPg3DgDi38mmtgrwrImQSMIFn',
                            ];        
                            subnoti = {
                                title: 'FWG Outing 2019', 
                                body: descriptionName
                            };
                            console.log(emp);

                        var serverKey = "AAAADiErUm0:APA91bEmeovrztacQgZjGvZ5EBvuTDmXk4aMMX1tkXKTY8uOhem-5HEGOScan7LIYq5X5Gswjm21KVbHAC293nNmnnEnLuvoQO5ftTJzND6BWjXfMY3T9E_OPp5r4c4_S2TvzlcVzpId";
                        var fcm = new FCM(serverKey);
                        var message = {
                            registration_ids: emp,
                            notification: subnoti
                        }
                        fcm.send(message, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                                console.log(err);
                            } else {
                                console.log("---------------------");
                                console.log('Running Cron Job '+time_at);
                                console.log("Successfully sent with response: ", response);
                                console.log("---------------------");
                            }
                        }); 
                        // 

                    }else{

                        console.log("---------------------");
                        console.log("No Employee "+shortName);
                        console.log("---------------------");

                    }
                    
                });

                console.log(time_at+" Activity Have "+shortName);                

            }else{

                console.log("---------------------");
                console.log(time_at+" No Activity");
                console.log("---------------------");

                marr= "";
                subnoti ="";

            }

        });

    });

};

module.exports = {
    fcmCron
};
