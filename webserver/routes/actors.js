var express = require('express');
var router = express.Router();
var db = require('../db');

router.get("/:key", function(req, res, next) {
    var moviekey = parseInt(req.params.key, 10);
    if (!Number.isInteger(moviekey)){
        res.status(400).send("Requested movie does not exist!");
        return;
    }
    var query_string = "SELECT A.*, M.movie_title, M.mid, M.image_url as \"movie_url\", D.name as \"director_name\", D.did, D.image_url as \"director_url\""
        + " FROM Directors D, Movies M, Actors A, Director_Movie DM, Actor_Movie AM"
        + " WHERE A.aid=" + req.params.key + " AND AM.aid=" + req.params.key + " AND AM.mid=M.mid AND DM.mid=AM.mid AND D.did=DM.did";
    db.get().query(query_string,function(err,rows, fields){
        if (err) throw err;
        var directors = [];
        var movies = [];
        rows.forEach(function(entry){
            if (objectArrayIndexOf(directors,entry.did,"did") === -1){
                directors.push({
                    name: entry.director_name,
                    did: entry.did,
                    image_url: entry.director_url
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
        res.render('actor_detail.ejs', {
            data: rows[0],
            directors: directors,
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
