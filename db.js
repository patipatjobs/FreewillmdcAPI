const mysql = require('mysql');

var host = 'freewillmdc.loginto.me';
var port = '56860';

const connectionHR = mysql.createConnection({   
    host     : host,
    port     : port,
    user     : 'fwghr',
    password : 'fwg@mdc04111',
    database : 'fwg_hr'
});

const connectionHRServices = mysql.createConnection({   
    host     : '52.163.82.249',
    port     : '1178',
    user     : 'promptadm',
    password : 'chee#Mai5',
    database : 'hrservices'
});

const connectionLogs = mysql.createConnection({   
    host     : host,
    port     : port,
    user     : 'fwglogserver',
    password : 'Logs@04111',
    database : 'fwg_logserver'
});



module.exports = {
    connectionHR,
    connectionLogs,
    connectionHRServices
};