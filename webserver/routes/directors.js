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
        var director_data = rows[0];
        query_string = "SELECT AVG(rating) AS avg_rating, COUNT(rating) as count FROM (SELECT rating FROM Director_Ratings WHERE did=" + moviekey + ") t1";
        db.get().query(query_string, function(err,rows, fields){
            res.render('director_detail.ejs', {
                data: director_data,
                actors: actors,
                movies: movies,
                avg_rating: rows[0].avg_rating,
                rating_count: rows[0].count
            });
        });
    });
});

router.post("/update/:key", function(req, res, next) {
    var query_string = "UPDATE Directors SET";
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
    query_string += " WHERE did=" + req.params.key;
    db.get().query(query_string, function(err, results){
        if (err) throw err;
        var now = new Date();
        var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
        query_string = " INSERT INTO Director_Edits SET ? ON DUPLICATE KEY UPDATE timestamp='"
            + timestamp + "'";
        var insert_info = { 
            timestamp: timestamp,
            uid: req.body.uid,
            did: req.params.key
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
