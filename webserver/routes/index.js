var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
    db.get().query("SELECT M.mid, M.movie_title, M.image_url FROM Movies M, (SELECT R.mid, AVG(R.rating) as rating FROM Movie_Ratings R GROUP BY R.mid ORDER BY rating DESC LIMIT 20) bs WHERE M.mid=bs.mid", function (err, rows, fields){
        if (err) throw err;
        res.render('index', { title: 'Homepage', movies: rows });
    });
});

module.exports = router;
