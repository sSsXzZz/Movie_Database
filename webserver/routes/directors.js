var express = require('express');
var router = express.Router();
var db = require('../db');

router.get("/:key", function(req, res, next) {
    var moviekey = parseInt(req.params.key, 10);
    if (!Number.isInteger(moviekey)){
        res.status(400).send("Requested movie does not exist!");
        return;
    }
    var query_string = "SELECT D.*, M.movie_title, M.mid, M.image_url as \"movie_url\", A.name as \"actor_name\", A.aid, A.image_url as \"actor_url\""
        + " FROM Directors D, Movies M, Actors A, Director_Movie DM, Actor_Movie AM"
        + " WHERE D.did=" + req.params.key + " AND DM.did=" + req.params.key + " AND DM.mid=M.mid AND AM.mid=DM.mid AND A.aid=AM.aid";
    db.get().query(query_string,function(err,rows, fields){
        if (err) throw err;
        var actors = [];
        var movies = [];
        rows.forEach(function(entry){
            if (objectArrayIndexOf(actors,entry.aid,"aid") === -1){
                actors.push({
                    name: entry.actor_name,
                    aid: entry.aid,
                    image_url: entry.actor_url
                });
            }
            if (objectArrayIndexOf(movies,entry.mid,"mid") === -1){
                movies.push({
                    movie_title: entry.movie_title,
                    mid: entry.mid,
                    image_url: entry.movie_url,
                });
            }
        });
        console.log(actors);
        res.render('director_detail.ejs', {
            data: rows[0],
            actors: actors,
            movies: movies,
        });
    });
});

function objectArrayIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}
module.exports = router;
