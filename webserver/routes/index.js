var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
    db.get().query("SELECT movie_title FROM Movies ORDER BY movie_title", function (err, rows, fields){
        if (err) throw err;
        var movies = rows.map(function(movie) {
            return movie.movie_title;
        });
        res.render('index', { title: 'Homepage', movies: movies });
    });
});

module.exports = router;
