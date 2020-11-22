const express = require('express');
const mysql = require('mysql');
var cron = require('node-cron');
const moment = require('moment');
const momentz = require('moment-timezone');
const dateFormat = require('dateformat');

const app = express(); 

var host = 'freewillmdc.loginto.me';
var port = '56860';

const connectionHR = mysql.createConnection({   
    host     : host,
    port     : port,
    user     : '____',
    password : '____',
    database : '____'
});

const connectionHRServices = mysql.createConnection({   
    host     : '52.163.82.249',
    port     : '1178',
    user     : '____',
    password : '____',
    database : '____'
});

const dateT = moment().tz('Asia/Bangkok').format("YYYY-MM-DD");
const timeT = moment().tz('Asia/Bangkok').format("HH:mm:ss");
const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss"); 

var sql = "SELECT * FROM employee_device_info WHERE DATE(created_date) = '"+dateT+"'";

var sqldelete = "DELETE FROM employee_device_info WHERE DATE(created_date)  = '"+dateT+"'";

var sqlinsert = "INSERT INTO employee_device_info(employee_id,device_id,os,service,device_token,active,created_date,last_message) VALUES ";


function dataUpdated(){

    console.log(time_at+" Data Updated");

}

function getHRServices(){

    connectionHRServices.query(sql, function (err, rows){

        pushData(rows);


    });

}

function pushData(rows){

    var SRowsDataEmp = [];
    var SRowsDataDevice = [];
    var SRowsDataos = [];
    var SRowsDataservice = [];
    var SRowsDatadevice_token = [];
    var SRowsDataactive = [];
    var SRowsDatacreated_date = [];
    // var SRowsDatalast_message = [];

    for(var i = 0; i < rows.length;i++){

        SRowsDataEmp.push(rows[i].employee_id);
        SRowsDataDevice.push(rows[i].device_id);
        SRowsDataos.push(rows[i].os);
        SRowsDataservice.push(rows[i].service);
        SRowsDatadevice_token.push(rows[i].device_token);
        SRowsDataactive.push(rows[i].active);
        SRowsDatacreated_date.push(dateFormat(rows[i].created_date, "yyyy-mm-dd HH:mm:ss"));
        // SRowsDatalast_message.push(rows[i].last_message);

        sqlinsert += "('"+SRowsDataEmp[i]+"','"+SRowsDataDevice[i]+"','"+SRowsDataos[i]+"','"+SRowsDataservice[i]+"','"+SRowsDatadevice_token[i]+"','"+SRowsDataactive[i]+"','"+SRowsDatacreated_date[i]+"',null)";

        if(i != rows.length-1){
            sqlinsert += ",";
        }

    }        

    // console.log(time_at+" : "+sqlinsert);

}

function actionData(a){

    connectionHR.query(a, function (err, rows,result){

        console.log(time_at+" : "+a);
        console.log("--------------------------------------");

    });

}

const checkUpdateDataToday = async () => {

    var a;
    var b;
    var RowsDataEmpFWG = [];
    var RowsDataEmp = [];     

    connectionHRServices.query(sql, function (err, rows){

        RowsDataHRServices = rows;

        a = rows.length;

        connectionHR.query(sql, function (err, rows){
        
            RowsDataFWG = rows;

            b = rows.length;

            if(a === 0){

                dataUpdated();

            }else if(b === 0){

                getHRServices();        
                actionData(sqlinsert);

            }else if(a > b){
                
                actionData(sqldelete);
                
            }else if(a === b){

                dataUpdated();

            }

        });        

    });

}

const SycDeviceInfoDB = () => {

    console.log(time_at+' Start Cron Job SycDB');

    // var ctime = '00,05,10,15,20,25,30,35,40,45,50,55 * * * *';

    var ctime = '*/2 * * * *';

    cron.schedule(ctime, function () { 

        console.log(time_at+' Syc DB Running Cron Job');
            
        checkUpdateDataToday();

    });

    console.log('------------------------');

};

module.exports = {
    SycDeviceInfoDB
};


// DELETE FROM employee_device_info WHERE DATE(created_date)  = '2019-09-25'

// [RowsDataHRServices.employee_id,RowsDataHRServices.device_id,RowsDataHRServices.os,RowsDataHRServices.service,RowsDataHRServices.device_token,RowsDataHRServices.active,RowsDataHRServices.created_date,RowsDataHRServices.last_message]