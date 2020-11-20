const express = require('express');
const moment = require('moment');
var momentz = require('moment-timezone');

const app = express();
var router = express.Router();

///////////////////////////////////////////////////////
const times_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");
//////////////////////////////////////////////////////


module.exports.mdclogs = function (){

    return res.json(err);
};

///////////////////////////////////////////////////////////////

module.exports = {router,times_at};