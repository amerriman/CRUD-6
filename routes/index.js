var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/cookies', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query('SELECT * FROM cookies ORDER BY id ASC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

router.get('/cookie/:cookie_id', function(req, res) {

    var results = [];

    var data = {id: req.params.cookie_id};
    // var data = req.params.cookie_id;  - can do this too, but in the query you just put data, not data.id

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query('SELECT * FROM cookies WHERE id=($1);', [data.id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});


router.post('/cookies', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {type: req.body.type};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        //$1 is a placeholder, if there's $2 it takes the second in an array
        client.query("INSERT INTO cookies(type) values($1)", [data.type]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM cookies ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});


router.put('/cookies/:cookie_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.cookie_id;

    // Grab data from http request
    var data = {type: req.body.type};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE cookies SET type=($1) WHERE id=($2)", [data.type, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM cookies ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});


router.delete('/cookies/:cookie_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.cookie_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM cookies WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM cookies ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

module.exports = router;

//whats with the --data or the -X?  Why no "POST" in front of the first one

// curl --data "type=Sugar" http://:3000/api/v1/cookies

//curl -X PUT --data "type=Double Fudge" http://localhost:3000/cookies/1

//curl -X DELETE http://:3000/cookies/2
