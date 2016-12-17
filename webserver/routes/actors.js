var express = require('express');
var router = express.Router();
var db = require('../db');
var dateFormat = require('dateformat');

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

router.post("/update/:key", function(req, res, next) {
    var query_string = "UPDATE Actors SET";
    var comma_flag = 0;
    if (req.body.name.length > 0 ){
        query_string += " name='" + req.body.name + "'";
        comma_flag = 1;
    }
    if (req.body.image_url.length > 0){
        if (comma_flag){
            query_string += ",";
        }
        query_string += " image_url='" + req.body.image_url + "'";
    }
    query_string += " WHERE aid=" + req.params.key;
    db.get().query(query_string, function(err, results){
        if (err) throw err;
        var now = new Date();
        var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
        query_string = " INSERT INTO Actor_Edits SET ? ON DUPLICATE KEY UPDATE timestamp='"
            + timestamp + "'";
        var insert_info = { 
            timestamp: timestamp,
            uid: req.body.uid,
            aid: req.params.key
        }
        db.get().query(query_string, insert_info, function(err, results){
            if (err) throw err;
            res.status(200).send();
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
