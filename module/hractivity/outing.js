const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment');
var momentz = require('moment-timezone');
var multer  = require('multer');
// const readXlsxFile = require('read-excel-file/node');
// const date = require('date-and-time');
const cors = require('cors');

var helper = require('../../helper');

const app = express();
var router = express.Router();
app.use(bodyParser.json());
app.use(cors());



var connection = mysql.createConnection({   
            host     : 'freewillmdc.loginto.me', 
            port     : '56860',
            user     : '____',
            password : '____',
            database : '____'
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

///////////////////////////////////////////////////////
const time_at = moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss");
//////////////////////////////////////////////////////
 
// -> Multer Upload Storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	   cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
	   cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
	}
});

const upload = multer({storage: storage});

// -> Express Upload RestAPIs
// app.post('/uploadExcel', upload.single("uploadfile"), (req, res) =>{
// 	importExcelData2MySQL('uploads/' + req.file.filename);
// 	res.json({
// 				'msg': 'File uploaded/import successfully!', 'file': req.file
// 			});
// });

// -> Import Excel Data to MySQL database
// function importExcelData2MySQL(filePath){
	// File path.
	// readXlsxFile(filePath).then((rows) => {
		// `rows` is an array of rows
		// each row being an array of cells.	 
		// console.log(rows);
	 
		/**
		[ [ 'Id', 'Name', 'Address', 'Age' ],
		[ 1, 'Jack Smith', 'Massachusetts', 23 ],
		[ 2, 'Adam Johnson', 'New York', 27 ],
		[ 3, 'Katherin Carter', 'Washington DC', 26 ],
		[ 4, 'Jack London', 'Nevada', 33 ],
		[ 5, 'Jason Bourne', 'California', 36 ] ] 
		*/
	 
		// Remove Header ROW
		// rows.shift();
	 
		// Open the MySQL connection
		// connection.connect((error) => {
		// 	if (error) {
		// 		console.error(error);
		// 	} else {
		// 		let query = 'INSERT INTO employee (employee_id, firstname, lastname, unit, department,section, organization,team) VALUES ?';
		// 		connection.query(query, [rows], (error, response) => {
		// 		console.log(error || response);

				/**
				OkPacket {
				fieldCount: 0,
				affectedRows: 5,
				insertId: 0,
				serverStatus: 2,
				warningCount: 0,
				message: '&Records: 5  Duplicates: 0  Warnings: 0',
				protocol41: true,
				changedRows: 0 } 
				*/
// 				});
// 			}
// 		});
// 	})
// }

function saveLog(a,b,c,d,e,ProjectName){

	var rowsLog = "('"+a+"','"+b+"','"+c+"','"+d+"','"+e+"','"+ProjectName+"','"+helper.times_at+"')";
	let query = 'INSERT INTO logs (employee_id, staff_id, activityName, description ,amount,project,created_at) VALUES '+rowsLog;
	
	connection.query(query, (error, response) => {

		console.log(time_at+' INSERT Log : '+a+' | Success ');

	});

}

//Web API
router.get('/lists/employee',(req,res,result)=> {
    
    let msgConsole = time_at+" GET Employee Lists  : ";

    // var sql = "select emp.employee_id, emp.firstname  as first_name_th,  emp.lastname as last_name_th, emp.unit, emp.department, emp.section, emp.organization, emp.team from employee as emp";
	var sql = "select * from employee as emp join employee_activity as empa on emp.employee_id = empa.employee_id";   
    var msg = 'employee Lists';
    
    connection.query(sql,(err,rows,results) => { 
        
        if(!err){
            res.json(rows)   
            console.log(msgConsole+err);
        }else{
            res.json(msgConsole+err)
            console.log(msgConsole+err);
            // connection.reconnect()
        }

	});
	

});

////////////////////////////////////////////////////////////////////////////////

//Mobile API
router.get('/dashboard/group_challenge',(req,res,result)=> {
	var sql = "SELECT * FROM group_challenge WHERE group_challenge.group = '"+req.query.group+"'";
	console.log(sql+" | Group Challenge : "+req.query.group);

	connection.query(sql,(err,rows,results,fields) => {

		res.json({
			"HEAD": rows.length,
			"BODY": rows,
			"MESSAGE": "Group Challenge Lists"
		});

	});

});


router.get('/dashboard/profile',cors(),(req,res,result)=> {

	var tmpEmployee_id = req.query.employee_id;
	var tmpStaff_id = req.query.staff_id;
	var tmpActivityName_id = req.query.activityname;
	var tmpDescription = req.query.description;
	var tmpAmount = req.query.amount;



	var sql = "select distinct emp.employee_id, concat(emp.firstname,' ',emp.lastname) as empName,emp.unit,emp.team ,CASE WHEN empa.bus= '' OR empa.bus= '0' OR empa.bus= NULL THEN 'รถส่วนตัว' WHEN empa.bus = 'KK' OR empa.bus = 'Bus KK' THEN 'ขอนแก่น' WHEN empa.bus='Car' THEN 'รถส่วนตัว'  WHEN empa.bus= 'Bus 1' OR empa.bus= '1' THEN 'รถบัส 1'  WHEN empa.bus= 'Bus 2' OR empa.bus= '2' THEN 'รถบัส 2' WHEN empa.bus= 'Bus 3' OR empa.bus= '3' THEN 'รถบัส 3' WHEN empa.bus= 'Bus 4' OR empa.bus= '4' THEN 'รถบัส 4'  END AS bus, CASE WHEN empa.follower_adult = '0' OR empa.follower_adult = NULL THEN 'ไม่มี' WHEN empa.follower_adult != '0' THEN empa.follower_adult END AS follower_adult, CASE WHEN empa.follower_child = '0' OR empa.follower_child = NULL THEN 'ไม่มี' WHEN empa.follower_child != '0' THEN empa.follower_child END AS follower_child, CASE WHEN empa.group_challenge= NULL THEN 'ไม่เข้าร่วม' WHEN empa.group_challenge!= '0' THEN group_challenge END AS group_challenge, CASE WHEN empa.theme_park= NULL THEN 'ไม่เข้าร่วม' WHEN empa.theme_park!= '0' OR empa.theme_park!= '' THEN empa.theme_park END AS theme_park, CASE WHEN empa.water_park= NULL THEN 'ไม่เข้าร่วม' WHEN empa.water_park!= '0' OR empa.water_park!= '' THEN empa.water_park END AS water_park, CASE WHEN empa.lunch1= NULL THEN 'ไม่เข้าร่วม' WHEN empa.lunch1 = 'Yes' THEN 'เข้าร่วม' WHEN empa.lunch1 = 'Yes2' THEN 'เข้าร่วม(เจ)' END AS lunch1, CASE WHEN empa.lunch2= '0' OR empa.lunch2= NULL THEN 'ไม่เข้าร่วม'  WHEN empa.lunch2 = 'Yes2' THEN 'เข้าร่วม(เจ)' WHEN empa.lunch2 = 'Yes' THEN 'เข้าร่วม' END AS lunch2, CASE WHEN empa.party= '0' OR empa.party= NULL THEN 'ไม่เข้าร่วม' WHEN empa.party!= '0' THEN 'เข้าร่วม' END AS party, buddy from employee as emp JOIN employee_activity as empa on emp.employee_id = empa.employee_id  WHERE emp.employee_id = '"+req.query.employee_id+"'";
	
	console.log(time_at+" Views Dashboard Profile : "+tmpEmployee_id+" | Request");
	
	//View Profile
    connection.query(sql,(err,rows,results,fields) => {

		var rowsData1 = rows;

		if(rows.length > 0){
		
			for (var i in rowsData1) { 
				Profile = rowsData1[i];
			}
			
			var sqlEvent = "select activity_name as activityName, description as description, DATE_FORMAT(date, '%Y-%m-%d') as date, TIME_FORMAT(time, '%H.%i') as time, images_url FROM activity";

			//View Activity
			connection.query(sqlEvent,(err,rows) => {

				var rowsData2 = rows;
				var Event = [];

				if(rowsData1[0].bus === '-' || rowsData1[0].bus === null){

				}else{

					bus= { "status" : rowsData1[0].bus };
					var bus = Object.assign(rowsData2[0],bus);
					Event.push(bus);


					if(rowsData1[0].theme_park != '' || rowsData1[0].theme_park != '-' ){ 
						theme_park= { "status" : rowsData1[0].theme_park };
						var theme_park = Object.assign(rowsData2[1],theme_park);
						Event.push(theme_park);
					}

					if(rowsData1[0].lunch1 == 'เข้าร่วม' || rowsData1[0].lunch1 == 'เข้าร่วม(เจ)'){ 
						lunch1= { "status" : rowsData1[0].lunch1 };
						var lunch1 = Object.assign(rowsData2[2],lunch1);
						Event.push(lunch1);
					}

					if(rowsData1[0].water_park != '' || rowsData1[0].water_park != '-' ){ 
						water_park= { "status" : rowsData1[0].water_park };
						var water_park = Object.assign(rowsData2[3],water_park);
						Event.push(water_park);
					}

					if(rowsData1[0].buddy != '0' || rowsData1[0].buddy != ''){ 
						buddy= { "status" : rowsData1[0].buddy };
						var buddy = Object.assign(rowsData2[4],buddy);
						Event.push(buddy);
					}

					if(rowsData1[0].party == 'เข้าร่วม' ){ 
						party= { "status" : rowsData1[0].party };
						var party = Object.assign(rowsData2[5],party);
						Event.push(party);
					}

					if(rowsData1[0].lunch2 == 'เข้าร่วม' ){ 
						lunch2= { "status" : rowsData1[0].lunch2 };
						var lunch2 = Object.assign(rowsData2[6],lunch2);
						Event.push(lunch2);
					}

					// images_url= { "images_url" : '' };
					// var images_url = Object.assign(rowsData2[7],images_url);
					// Event.push(images_url);

				}

				var rowsData = { Profile,Event };

				res.json({
					"HEAD": rowsData1.length ,
					"BODY": rowsData ,
					"MESSAGE": "Employee Description"
				});

				console.log(time_at+" Views Dashboard Profile : "+tmpEmployee_id+" | Success");
				
				saveLog(tmpEmployee_id,tmpStaff_id,tmpActivityName_id,tmpDescription,tmpAmount,'Outing2019');

			});

		}else{

			res.json({
				"HEAD": rowsData1.length ,
				"BODY": {} ,
				"MESSAGE": "Employee Not Found"
			});

		}

	});	

});

router.get('/dashboard/roommate',(req,res,result)=>{ 
	var sql = "select employee.firstname , employee.lastname from employee INNER JOIN employee_activity ON employee.employee_id = employee_activity.employee_id WHERE employee_activity.buddy='"+req.query.room+"'";
	console.log(sql+" | Roommate : "+req.query.room);
	
	connection.query(sql,(err,rows,results,fields)=>{ 
	
	if (!err){      
			console.log("PASS"+err);
			res.json({ 
					"HEAD":200,
					"BODY":rows,
					"MESSAGE": "Roomate Name"
			});
	}else{ 
	
			console.log("ERROR"+err);
			res.json({
					"HEAD":502,
					"BODY":[],
					"MESSAGE": "Wrong Parameter"
			});
	}
	});
})


////////////////////////////////////////////////////////

module.exports = router;