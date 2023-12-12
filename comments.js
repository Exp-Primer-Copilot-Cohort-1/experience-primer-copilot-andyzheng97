// Create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

// Create server
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    //console.log("Example app listening at http://%s:%s", host, port);
});

// Create database connection
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Change password
    database: 'comments'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// Create table
connection.query("CREATE TABLE IF NOT EXISTS comments (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), comment TEXT)", function (err, result) {
    if (err) throw err;
    console.log("Table created");
});

// Get comments
app.get('/getComments', function (req, res) {
    fs.readFile(__dirname + "/" + "comments.json", 'utf8', function (err, data) {
        if (err) throw err;
        res.end(data);
    });
});

// Add comment
app.post('/addComment', jsonParser, function (req, res) {
    var name = req.body.name;
    var comment = req.body.comment;

    var sql = "INSERT INTO comments (name, comment) VALUES ('" + name + "', '" + comment + "')";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

    fs.readFile(__dirname + "/" + "comments.json", 'utf8', function (err, data) {
        if (err) throw err;

        var comments = JSON.parse(data);
        var comment = {
            "name": req.body.name,
            "comment": req.body.comment
        }

        comments.push(comment);
        fs.writeFile(__dirname + "/" + "comments.json", JSON.stringify(comments), function (err) {
            if (err) throw err;
            res.end(JSON.stringify(comments));
        });
    });
});

// Delete comment
app.post('/deleteComment', jsonParser, function (req, res) {
    var id = req.body.id;

    var sql = "DELETE FROM comments WHERE id = " + id;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record deleted");
    });

    fs.readFile(__dirname + "/" + "comments.json", 'utf8', function (err, data) {
        if (err) throw err;

        var comments = JSON.parse(data);
        comments.splice(id, 1);

        fs.writeFile(__dirname + "/" + "comments.json", JSON.stringify(comments), function (err) {
            if (err) throw err;
            res.end(JSON.stringify(comments));
        });
    });
})