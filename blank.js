const express = require('express');
var router = express.Router();

const app = express();

const config = require('./config');

router.get('',config.middleware,(req,res)=> { 
    res.json('Blank');
})
router.get('/api',config.middleware,(req,res)=> { 
    res.json('Blank');
})


module.exports = router;