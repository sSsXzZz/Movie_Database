var express = require('express');
var router = express.Router();
var db = require('../db');

router.get("/:key", function(req, res, next) {
    var moviekey = parseInt(req.params.key, 10);
    if (!Number.isInteger(moviekey)){
        res.status(400).send("Requested movie does not exist!");
        return;
    }
    var query_string = "SELECT * FROM Movies WHERE mid=" + moviekey;
    db.get().query(query_string,function(err,rows, fields){
        if (err) throw err;
        res.render('movie_detail.ejs', {data: rows[0] });
    });
});

module.exports = router;
