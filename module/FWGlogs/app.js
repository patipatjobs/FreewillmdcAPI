const express = require('express');
var router = express.Router();

const app = express();

const SycDB = require('./SycDeviceInfoDB');

 


module.exports = {
    router,
    SycDB
};