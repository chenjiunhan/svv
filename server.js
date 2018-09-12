VIEWS_DIR = "pages/"

var express = require('express');
var app = express();
var fs = require('fs');

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Hello');
})

app.get('/create', function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	 
	MongoClient.connect(url, {useNewUrlParser: true }, function(err, db) {
	  	if (err) {
			throw err;
		}
		var dbo = db.db("JAQQ");
		dbo.createCollection("PTTArticle", function(err, res) {
            if (err) throw err;
            console.log("Collection created!");
        });
            
        db.close();
	});

	res.send("OK")
})

app.get('/drop', function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("JAQQ");
        dbo.collection("PTTArticle").drop(function(err, res) {
            if (err) throw err;
            if (res) console.log("Collection deleted");
        });

        db.close();
    });

	res.send("OK")
})

app.get('/find', function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	MongoClient.connect(url, {useNewUrlParser: true }, function(err, db) {
	  	if (err) {
			throw err;
		}
		var dbo = db.db("JAQQ");
        
        //var cursor = dbo.collection('PTTArticle').find({$where: "this.ts > 1531572207"});
        var cursor = dbo.collection('PTTArticle').find();
        
	    var result = ""
        //Execute the each command, triggers for each document
        cursor.toArray(function(err, items) {
            result = JSON.stringify(items)
            db.close()
            send(result)
        })

        function send(result) {
            res.send(result)
        }
    });
})

app.get('/index', function (req, res) {

    view_path = VIEWS_DIR + "index.ejs"

    var data = {
        title: 'Index',
        website_name: '丞相，起風了'
    }

    res.render(view_path, data)

})

app.get('/person', function (req, res) {

    view_path = VIEWS_DIR + "person.ejs"

    var data = {
        title: 'Index',
        website_name: '丞相，起風了'
    }

    res.render(view_path, data)

})


app.get('*', function (req, res) {
    //console.log(req, res)
    filePath = __dirname + "/" + req.url
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendStatus(404);
    }
})

var server = app.listen(8080, function () {
     
    var host = server.address().address
    var port = server.address().port

    console.log("%s %s", host, port)
               
})

