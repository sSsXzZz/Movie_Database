var express = require('express');
var router = express.Router();
var db = require('../db');
var dateFormat = require('dateformat');
var async = require('async');


router.get("/:key", function(req, res, next) {
    var moviekey = parseInt(req.params.key, 10);
    if (!Number.isInteger(moviekey)){
        res.status(400).send("Requested movie does not exist!");
        return;
    }
    var key = req.params.key;

    async.waterfall([
        function(callback){
            var query_string = "SELECT DISTINCT A.* FROM Actors A WHERE A.aid=" + key;
            db.get().query(query_string, function(err,rows,fields){
                var data = {
                    data: rows[0]
                };
                callback(null,data);
            });
        },
        function(data,callback){
            var query_string = "SELECT DISTINCT M.movie_title, M.mid, M.image_url FROM Movies M, Actor_Movie AM WHERE M.mid=AM.mid AND AM.aid=" + data.data.aid;
            db.get().query(query_string, function(err,rows,fields){
                data["movies"] = rows;
                callback(null,data);
            });
        },
        function(data,callback){
            var query_string = "SELECT DISTINCT D.name, D.did, D.image_url FROM Directors D, Director_Movie DM, Actor_Movie AM WHERE AM.aid="
                + data.data.aid
                + " AND AM.mid=DM.mid AND DM.did=D.did";
            db.get().query(query_string, function(err,rows,fields){
                data["directors"] = rows;
                callback(null,data);
            });
        },
        function(data,callback){
            var query_string = "SELECT AVG(rating) AS avg_rating, COUNT(rating) as count FROM (SELECT rating FROM Actor_Ratings WHERE aid=" + data.data.aid + ") t1";
            db.get().query(query_string, function(err,rows, fields){
                data["avg_rating"] = rows[0].avg_rating;
                data["rating_count"] = rows[0].count;
                res.render('actor_detail.ejs', data);
                callback(null);
            });
        }
    ], function(err,results){
        if (err) throw err;
    });

    /*
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
        var actor_data = rows[0];
        query_string = "SELECT AVG(rating) AS avg_rating, COUNT(rating) as count FROM (SELECT rating FROM Actor_Ratings WHERE aid=" + moviekey + ") t1";
        db.get().query(query_string, function(err,rows, fields){
            console.log(actor_data);
            res.render('actor_detail.ejs', {
                data: actor_data,
                directors: directors,
                movies: movies,
                avg_rating: rows[0].avg_rating,
                rating_count: rows[0].count
            });
        });
    });
    */
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

router.post("/new", function(req, res, next) {
    var query_string = "SELECT 1 from Actors where name=\"" + req.body.name + "\"";
    db.get().query(query_string, function(err, rows, fields){
        if (err) throw err;
        if (rows.length > 0){
            res.status(400).send("An actor by this name already exists!");
            return;
        }
        query_string = "INSERT INTO Actors SET ?";
        var data = {};
        data["name"] = req.body.name;
        data["image_url"] = req.body.image_url;
        db.get().query(query_string, data, function(err, results){
            if (err) throw err;
            res.status(200).send();
        });
    });

});

router.post("/delete/:key", function(req, res, next) {
    var query_string = "DELETE FROM Actors WHERE aid=" + req.body.aid;
    db.get().query(query_string, function(err, results){
        if (err) throw err;
        res.status(200).send();
    });
});

router.post('/rating_history/:key', function(req,res,next){
    var query_string = "SELECT A.name, A.image_url, AR.rating, AR.comments, AR.timestamp"
        + " FROM Actors A, Actor_Ratings AR WHERE AR.aid=A.aid"
        + " AND A.aid=" + req.params.key + " ORDER BY timestamp DESC";
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        console.log(rows);
        res.status(200).send(rows);
    });
});


function objectArrayIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

module.exports = router;
