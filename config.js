// const mysql = require('mysql');
const sha256 = require('sha256');
const moment = require('moment');
const momentz = require('moment-timezone');
const middleware = (req, res, next) => {

    var chkmobile = sha256('@MDC');

    const token = req.headers.authorization;

    if(token  === chkmobile)
        next();
    else
        res.json("Access Denied")

}; 

module.exports = {
    middleware
};

////////////////////////////////////////////////////////

// Mobile
// 6da58f9ce5a1e86bcd6c5e5f2a0157c18bbedbd06c90fffa8faefb1eb3dbe08c
