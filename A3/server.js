// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas. 
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.


// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));


// ###############################################################################
// Routes
// 
// TODO: Add your routes here and remove the example routes once you know how
//       everything works.
// ###############################################################################

app.get("/phones.db", (req, res, next) => {
    //var sql = "SELECT * FROM phones"
    //var params = []
    db.all("SELECT * FROM phones", [], (err, rows) => {
        res.setHeader('Content-Type','application/json');
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "data": rows
        })
    });
});

app.get("/phones.db/:id", (req, res, next) => {
    //var sql = "SELECT * FROM phones WHERE id=?"
    var selectedId = [req.params.id]
    db.get("SELECT * FROM phones WHERE id=?", selectedId, (err, row) => {
        res.setHeader('Content-Type','application/json');
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        } else if(!row) {
            res.status(404).json({"error": "Product not found"});
            return;
        }
        res.json({
            "data":row
        })
    });
});

app.post("/phones.db", (req, res, next) => {
    var data = {
        brand: req.body.brand,
        model: req.body.model,
        os: req.body.os,
        image: req.body.image,
        screensize: req.body.screensize
    }
    var dataValues = [data.brand, data.model, data.os, data.image, data.screensize]
    db.run('INSERT INTO phones (brand, model, os, image, screensize) VALUES (?,?,?,?,?)', dataValues, function (err, result) {
        res.setHeader('Content-Type','application/json');
        if(err) {
            res.status(400).json({"error": err.message})
            return;
        }
        let newId = this.lastID;
        res.status(201).json({ "url": 'http://localhost:3000/phones.db/' + newId})
    });
})


app.put("/phones.db/:id", (req, res, next) => {
    var data = {
        brand: req.body.brand,
        model: req.body.model,
        os: req.body.os,
        image: req.body.image,
        screensize: req.body.screensize
    }
    
    db.run(`UPDATE phones SET brand=COALESCE(?,brand), model=COALESCE(?,model), os=COALESCE(?,os), image=COALESCE(?,image), screensize=COALESCE(?,screensize) WHERE id=?`,[data.brand, data.model, data.os, data.image, data.screensize,req.params.id], function(err, result) {
        res.setHeader('Content-Type','application/json');
        if(err) {
            res.setHeader('Content-Type','application/json');
            res.status(400).json({"error": err.message})
            return;
        }
        res.setHeader('Content-Type','application/json');
        res.status(204).json({
            "data": data,
        })
    });
})

app.delete("/phones.db/:id", (req, res, next) => {
    var deleteId = [req.params.id]
    db.get(`SELECT * FROM phones WHERE id=?`, deleteId, function(err,row) {
        res.setHeader('Content-Type','application/json');
        if(err) {
            res.status(400).json({"error": err.message});
            return;
        } else if(!row) {
            res.status(404).json({"error": "Product not found"});
            return;
        }
        db.run(`DELETE FROM phones WHERE id=?`, req.params.id, function(err2,result) {
            if(err2) {
                res.status(400).json({"error": err2.message})
                return;
            } 
            res.status(204);
            res.json({"status":"deleted"});
    });
        
    })
    
})

// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.

app.get("/hello", function(req, res) {
    response_body = {'Hello': 'World'} ;

    // This example returns valid JSON in the response, but does not yet set the
    // associated HTTP response header.  This you should do yourself in your
    // own routes!
    res.json(response_body) ;
});


// This route responds to http://localhost:3000/db-example by selecting some data from the
// database and return it as JSON object.
// Please test if this works on your own device before you make any changes.
app.get('/db-example', function(req, res) {
    // Example SQL statement to select the name of all products from a specific brand
    db.all(`SELECT * FROM phones WHERE brand=?`, ['Fairphone'], function(err, rows) {
	
    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
        if(err) {
            console.error(err.message);
        }
    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.
        
        res.setHeader('Content-Type','application/json');
        res.status(200);
    	// # Return db response as JSON
    	return res.json(rows)
    });
});

app.post('/post-example', function(req, res) {
	// This is just to check if there is any data posted in the body of the HTTP request:
	console.log(req.body);
	return res.json(req.body);
});


// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
     
			}
		});
	});
	return db;
}

//source: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/