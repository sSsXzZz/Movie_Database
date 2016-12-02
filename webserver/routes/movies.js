var express = require('express');
var router = express.Router();
var db = require('../db');

router.get("/:key", function(req, res, next) {
    var moviekey = parseInt(req.params.key, 10);
    if (!Number.isInteger(moviekey)){
        res.status(400).send("Requested movie does not exist!");
        return;
    }
    var query_string = "SELECT M.*, A.name as \"actor_name\", D.name as \"director_name\" " 
    + "FROM Movies M, Actors A, Actor_Movie AM, Directors D, Director_Movie DM " 
    + "WHERE M.mid=" + moviekey + " AND AM.mid=" + moviekey + " AND A.aid=AM.aid" + " AND DM.mid=" + moviekey + " AND D.did=DM.did";
    db.get().query(query_string,function(err,rows, fields){
        if (err) throw err;
        console.log(rows);
        var actors = rows.map(function(a) { return a.actor_name });
        res.render('movie_detail.ejs', {data: rows[0], actors: actors, director: rows[0].director_name });
    });
});

module.exports = router;
