var express = require('express');
var router = express.Router();
var db = require('../db');

/*
router.get('/', function(req, res, next) {
    db.get().query("SELECT movie_title FROM Movies ORDER BY movie_title", function (err, rows, fields){
        if (err) throw err;
        var movies = rows.map(function(movie) {
            return movie.movie_title;
        });
        res.render('index', { title: 'Homepage', movies: movies });
    });
});
*/
router.post('/login', function(req,res,next){
    if (!req.body.username || !req.body.password){
        res.status(400).send('No username or password specified!');
    }
    var query_string = "SELECT 1 FROM Users WHERE "
        + "username='" + req.body.username
        + "' AND password='" + req.body.password + "'";
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        if (rows.length < 1){
            res.status(403).send('Invalid credentials!');
        } else{
            console.log("User " + req.body.username + " has logged in\n");
            res.send(200);
        }
    });
});

module.exports = router;
