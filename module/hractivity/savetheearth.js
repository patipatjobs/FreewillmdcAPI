const express = require('express');
const mysql = require('mysql');
const mariadb = require('mariadb');


const bodyParser = require('body-parser');
const moment = require('moment');
var momentz = require('moment-timezone');

var multer  = require('multer');
const image2base64 = require('image-to-base64');

const app = express();
var router = express.Router();

app.use(bodyParser.json())

    var connection = mysql.createConnection({   
            host     : 'freewillmdc.loginto.me', 
            port     : '56860',
            user     : '____',
            password : '____',
            database : '____'
    });

// var connection = mariadb.createConnection({host: '46.51.219.161:56860', user: 'fwghr', password: 'fwg@mdc04111'})
//         .then(conn => {
//         conn.query("select 1", [2])
//             .then(rows => {
//             console.log(rows); // [{ "1": 1 }]
//             conn.end();
//             })
//             .catch(err => { 
//             //handle query error
//             });
//         })
//         .catch(err => {
//         //handle connection error
// });

connection.connect(function(err){
        if  (err){
            console.log(time_at+" ERR CONNECTION : "+err.stack);
            return;
        }else{
            console.log(time_at+" CONNECTION Save The Earth ON :"+connection.threadId)
        }

});
 
///////////////////////////////////////////////////////
const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");
//////////////////////////////////////////////////////

//History
router.get('',(req,res)=> { 
    let msgConsole = time_at+" GET History Query : ";
    let sql = "SELECT COUNT(employee_id) as totalall FROM save_the_earth WHERE employee_id = "+req.query.employee_id;

     connection.query(sql,(err,rows,results) => { 
        if(!err){
            // var totalalljson = [{ "totalall": rows[0].totalall }]
            var totalall = rows[0].totalall;
                let sql = "SELECT DATE_FORMAT(receipt_date,'%d %b %Y') as receipt_date,COUNT(receipt_date) as total FROM save_the_earth WHERE employee_id = "+req.query.employee_id+" GROUP BY receipt_date DESC";
                connection.query(sql,(err,rows,results) => { 
                res.json({ "HEAD": rows.length , "BODY" : rows, "TOTAL" : totalall, "MESSAGE": "Summary by GET Query"})                 
            })
        }else{
            res.json(msgConsole+err)
            console.log(msgConsole+err);
        }
    });

    // connection.end();

});

// router.get('/:id',(req,res)=> { 
    
//     let msgConsole = time_at+" GET History Params : ";
//     let sql = "SELECT COUNT(employee_id) as totalall FROM save_the_earth WHERE employee_id = "+req.params.id;
//     connection.query(sql,(err,rows,results) => { 
//         if(!err){
//             // var totalalljson = [{ "totalall": rows[0].totalall }]
//             var totalall = rows[0].totalall;
//             let sql = "SELECT DATE_FORMAT(receipt_date,'%d %b %Y') as receipt_date,COUNT(receipt_date) as total FROM save_the_earth WHERE employee_id = "+req.params.id+" GROUP BY receipt_date DESC";
//             connection.query(sql,(err,rows,results) => { 
//                 res.json({ "HEAD": rows.length , "BODY" : rows, "TOTAL" : totalall, "MESSAGE": "Summary by GET Params"})               
//             })
//             console.log(msgConsole+err);
//         }else{
//             res.json(msgConsole+err)
//             console.log(msgConsole+err);
//         }
//     })

    // connection.end();

// })

//Ranking
router.get('/ranking/team',(req,res,result)=> {
    
    let msgConsole = time_at+" GET Ranking Team : ";

    var sql = "select ROW_NUMBER() OVER(ORDER BY COUNT(se.employee_id) DESC) AS No, emp.team, COUNT(se.employee_id) as total from save_the_earth as se JOIN employee as emp ON se.employee_id = emp.employee_id Group by emp.team order by No ASC";
        
    var msg = 'Team Ranking';
    
    connection.query(sql,(err,rows,results) => { 

        
        if(!err){
            res.json({ "HEAD": rows.length , "BODY" : rows, "MESSAGE": msg })   
            console.log(msgConsole+err);
        }else{
            res.json(msgConsole+err)
            console.log(msgConsole+err);
            connection.reconnect()
        }


    });

});

router.get('/ranking/department',(req,res,result)=> {
    
    let msgConsole = time_at+" GET Ranking Department : ";

    var sql = "select ROW_NUMBER() OVER(ORDER BY COUNT(se.employee_id) DESC) AS No, emp.unit AS Department, COUNT(se.employee_id) as total from save_the_earth as se  JOIN employee as emp ON se.employee_id = emp.employee_id Group by emp.unit order by No ASC Limit 25";

    var msg = 'Department Ranking';

    
    connection.query(sql,(err,rows,results) => { 

        if(!err){
            res.json({ "HEAD": rows.length , "BODY" : rows, "MESSAGE": msg })   
            console.log(msgConsole+err);
        }else{
            res.json(msgConsole+err)
            console.log(msgConsole+err);
            connection.reconnect()
        }

        // connection.end();
    });

});

///////////////////////// Upload Setting /////////////////////////////////////////
var fileImg = 'save_the_earth'+'-'+Date.now()+'.jpg';
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, fileImg)
    }
  });
   
var upload = multer({ storage: storage })

///////////////////////////////////////////////////////////////////////////////////

//Upload Path
// router.post('/path', upload.single('images'), (req, res, next) => {
//     const file = req.file
//     const images = 'uploads/'+fileImg
//     if (!file) {
//       const error = new Error('Please upload a images')
//       error.httpStatusCode = 400
//       return next(error)
//     }else{
//         var receipt_date = req.body.receipt_date;
//         var receipt_no = req.body.receipt_no;
//         var employee_id = req.body.employee_id;
//         
//         let msgConsole = time_at+" POST Upload Path : ";
//         const sql = "INSERT INTO save_the_earth (receipt_date,receipt_no,images,employee_id) VALUES (?,?,?,?)";
//         connection.query(sql, [receipt_date,receipt_no,images,employee_id], function (err, rows, fields) {
//             if(!err){
    
//                  res.json({ "HEAD": 201 ,"BODY": rows.insertId ,"MESSAGE": "Upload Success" }) 
//                  console.log(msgConsole+err);
    
//                 // connection.query('SELECT * FROM save_the_earth WHERE'+employee_id,(err,rows,results) => { 
//                 //     if(!err){
//                 //         res.json({ "HEAD": 201 ,"BODY": rows.length ,"MESSAGE": "Add Success" })   
//                 //     }else{
//                 //         res.json({ "HEAD": "","BODY": "" ,"MESSAGE": err })
//                 //         console.log(err);
//                 //     }   
//                 // })
    
//             }else{
//                 res.json(msgConsole+err)
//                 console.log(msgConsole+err);
//             }    
//         })   
//     }

     // connection.end();
    
// })

//Upload Based64
router.use(bodyParser.urlencoded({limit: '5mb', extended: true}))/
router.post('/based64', (req, res, next) => {
    var employee_id = req.body.employee_id;
    var receipt_date = req.body.receipt_date;
    var receipt_no = req.body.receipt_no;
    var images = req.body.images;    
    
    let msgConsole = time_at+" POST Upload Based64 : ";
    const sql = "INSERT INTO save_the_earth (receipt_date,receipt_no,images,employee_id) VALUES (?,?,?,?)";
    connection.query(sql, [receipt_date,receipt_no,images,employee_id], function (err, rows, fields) {
        if(!err){
            
            res.json({ "HEAD": 201 ,"BODY": rows ,"MESSAGE": "Upload Success" })  
            console.log(msgConsole+err);
            
            // connection.query('SELECT * FROM save_the_earth WHERE'+employee_id,(err,rows,results) => { 
            //     if(!err){
            //         res.json({ "HEAD": 201 ,"BODY": rows.length ,"MESSAGE": "Add Success" })    
            //     }else{
            //         res.json({ "HEAD": "","BODY": "" ,"MESSAGE": err })
            //         console.log(err);
            //     }   
            // })
        }else{
            res.json(msgConsole+err)
            console.log(msgConsole+err);
        }       
    }); 
    
    // connection.end();
    
});

///////////////////////////////////////////////////////////////

module.exports = router;