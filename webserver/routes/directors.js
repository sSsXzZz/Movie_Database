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
            var query_string = "SELECT DISTINCT D.* FROM Directors D WHERE D.did=" + key;
            db.get().query(query_string, function(err,rows,fields){
                var data = {
                    data: rows[0]
                };
                callback(null,data);
            });
        },
        function(data,callback){
            var query_string = "SELECT DISTINCT M.movie_title, M.mid, M.image_url FROM Movies M, Director_Movie DM WHERE M.mid=DM.mid AND DM.did=" + data.data.did;
            db.get().query(query_string, function(err,rows,fields){
                data["movies"] = rows;
                callback(null,data);
            });
        },
        function(data,callback){
            var query_string = "SELECT DISTINCT A.name, A.aid, A.image_url FROM Actors A, Director_Movie DM, Actor_Movie AM WHERE DM.did="
                + data.data.did
                + " AND DM.mid=AM.mid AND AM.aid=A.aid";
            db.get().query(query_string, function(err,rows,fields){
                data["actors"] = rows;
                callback(null,data);
            });
        },
        function(data,callback){
            var query_string = "SELECT AVG(rating) AS avg_rating, COUNT(rating) as count FROM (SELECT rating FROM Director_Ratings WHERE did=" + data.data.did + ") t1";
            db.get().query(query_string, function(err,rows, fields){
                res.render('director_detail.ejs', data);
                callback(null);
            });
        }
    ], function(err,results){
        if (err) throw err;
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

router.post("/new", function(req, res, next) {
    var query_string = "SELECT 1 from Directors where name=\"" + req.body.name + "\"";
    db.get().query(query_string, function(err, rows, fields){
        if (err) throw err;
        if (rows.length > 0){
            res.status(400).send("A director by this name already exists!");
            return;
        }
        query_string = "INSERT INTO Directors SET ?";
        var data = {};
        data["name"] = req.body.name;
        data["image_url"] = req.body.image_url;
        db.get().query(query_string, data, function(err, results){
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
