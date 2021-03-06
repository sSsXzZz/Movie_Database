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
    /*
    var query_string = "SELECT M.*, A.name as \"actor_name\", A.aid, A.image_url as \"actor_url\", D.name as \"director_name\", D.did, D.image_url as \"director_url\", G.name as \"genre\", K.keyword " 
    + "FROM Movies M, Actors A, Actor_Movie AM, Directors D, Director_Movie DM, Genres G, Movie_Keywords K " 
    + "WHERE M.mid=" + moviekey + " AND AM.mid=" + moviekey + " AND A.aid=AM.aid" + " AND DM.mid=" + moviekey + " AND D.did=DM.did" + " AND G.mid=" + moviekey + " AND K.mid=" + moviekey;
    */
    async.waterfall([
        function(callback){
            var query_string = "SELECT * FROM Movies WHERE mid=" + moviekey;
            db.get().query(query_string,function(err,rows,field){
                var movie_data = {
                    data: rows[0]
                }
                callback(null,movie_data);
            });
        },
        function(movie_data,callback){
            var query_string = "SELECT DISTINCT A.aid, A.name, A.image_url FROM Actors A, Actor_Movie AM WHERE AM.aid=A.aid AND AM.mid=" + moviekey;
            db.get().query(query_string,function(err,rows,field){
                movie_data["actors"]= rows;
                callback(null,movie_data);
            });
        },
        function(movie_data,callback){
            var query_string = "SELECT DISTINCT D.did, D.name, D.image_url FROM Directors D, Director_Movie DM WHERE DM.did=D.did AND DM.mid=" + moviekey;
            db.get().query(query_string,function(err,rows,field){
                movie_data["director"]= rows[0];
                callback(null,movie_data);
            });
        },
        function(movie_data,callback){
            var query_string = "SELECT keyword FROM Movie_Keywords WHERE mid=" + moviekey;
            db.get().query(query_string,function(err,rows,field){
                movie_data["keywords"]= rows;
                callback(null,movie_data);
            });
        },
        function(movie_data,callback){
            var query_string = "SELECT name FROM Genres WHERE mid=" + moviekey;
            db.get().query(query_string,function(err,rows,field){
                movie_data["genres"]= rows;
                callback(null,movie_data);
            });
        },
        function(movie_data,callback){
            var query_string = "SELECT AVG(rating) AS avg_rating, COUNT(rating) as count FROM (SELECT rating FROM Movie_Ratings WHERE mid=" + moviekey + ") t1";
            db.get().query(query_string, function(err,rows, fields){
                movie_data["avg_rating"] = rows[0].avg_rating;
                movie_data["rating_count"] = rows[0].count;
                res.render('movie_detail.ejs', movie_data);
            });
        },
    ],  function(err,results){
        if (err) throw err;
    });
    /*
    db.get().query(query_string,function(err,rows, fields){
        var actors = [];
        var genres = [];
        var keywords = [];
        var director = {
            did: rows[0].did,
            name: rows[0].director_name,
            image_url: rows[0].director_url,
        };
        rows.forEach(function(entry){
            if ( objectArrayIndexOf(actors,entry.aid,"aid") === -1){
                actors.push({
                    aid: entry.aid,
                    name: entry.actor_name,
                    image_url: entry.actor_url,
                });
            }
            if (genres.indexOf(entry.genre) === -1){
                genres.push(entry.genre);
            }
            if (keywords.indexOf(entry.keyword) === -1){
                keywords.push(entry.keyword);
            }
        });
        var movie_data = rows[0];

        query_string = "SELECT AVG(rating) AS avg_rating, COUNT(rating) as count FROM (SELECT rating FROM Movie_Ratings WHERE mid=" + moviekey + ") t1";
        db.get().query(query_string, function(err,rows, fields){
            res.render('movie_detail.ejs', {
                data: movie_data,
                actors: actors,
                director: director,
                genres: genres,
                keywords: keywords,
                avg_rating: rows[0].avg_rating,
                rating_count: rows[0].count
            });
        });
    });
    */
});

router.post("/update/:key", function(req, res, next) {
    var query_string = "UPDATE Movies SET ? WHERE mid=" + req.params.key;
    var update_info = Object.assign({},req.body);
    delete update_info["uid"];
    delete update_info["genres"];
    delete update_info["actors"];
    delete update_info["director"];
    delete update_info["keywords"];
    for (var key in update_info) {
        if (update_info[key].length <= 0){
            delete update_info[key];
        }
    }

    // UPDATE Movie fields
    if (Object.keys(update_info).length > 0 ){
        db.get().query(query_string, update_info, function(err, results){
            if (err) throw err;
        });
    }

    // Update keywords
    var request_key = req.params.key;
    if (req.body.keywords.length > 0){

        query_string = "DELETE FROM Movie_Keywords where mid=" + request_key;
        database = db.get();
        database.query(query_string, function(err,results){
            if (err) {
                throw err;
            }  

            var query_string2 = "INSERT INTO Movie_Keywords (mid,keyword) VALUES ?";
            var values = [];
            req.body.keywords.split(",").forEach( function(k){
                values.push([ parseInt(request_key), k]);
            });
            database.query(query_string2, [values], function(err,results){
                if (err) {
                    throw err;
                }  
            });
        });
    }

    // Update Actors
    if( req.body.actors.length > 0){

        var actors = req.body.actors.split(",");

        query_string = "SELECT aid, name from Actors where name=\"" + actors[0] + "\"";
        for (var i=1; i < actors.length; i++){
            query_string += " OR name=\"" + actors[i] + "\"";
        }
        // find all actors
        db.get().query(query_string,function(err,rows,fields){
            if (err) {
                throw err;
            }  

            // invalid actor names
            if (rows.length < actors.length){
                console.log("Invalid actor listed!");
                return;
            }
            var values =[];
            rows.forEach( function(actor){
                values.push([ parseInt(request_key), actor.aid]);
            });

            query_string = "DELETE FROM Actor_Movie where mid=" + request_key;

            // delete old ones
            db.get().query(query_string, function(err,results){
                if (err) {
                    throw err;
                }

                query_string = "INSERT INTO Actor_Movie (mid,aid) VALUES ?";
                // Insert new actors into db
                db.get().query(query_string, [values], function(err,results){
                    if (err) {
                        throw err;
                    }
                });
            });
        });
    }

    // Update Director
    var director = req.body.director;
    if( director.length > 0 ){
        console.log("UPDATING DIRECTORS!");
        query_string = "SELECT did, name from Directors where name=\"" + director + "\"";

        // find all directors
        db.get().query(query_string,function(err,rows,fields){
            if (err) {
                throw err;
            }
            // invalid director name
            if (rows.length <= 0){
            }
            query_string = "UPDATE Director_Movie SET ? WHERE mid=" + request_key;
            var insert_value ={
                did: rows[0].did,
                mid: parseInt(request_key),
            };

            // Insert new director
            db.get().query(query_string, insert_value, function(err,results){
                if (err) {
                    throw err;
                }
            });
        });
    }

    // Update Genres
    var genres = req.body.genres.split(",");
    if( req.body.genres.length > 0 ){
        query_string = "DELETE FROM Genres where mid=" + request_key;
        database = db.get();
        database.query(query_string, function(err,results){
            if (err) {
                throw err;
            }  

            var query_string2 = "INSERT INTO Genres (mid,name) VALUES ?";
            var values = [];
            genres.forEach( function(g){
                values.push([ parseInt(request_key), g]);
            });
            database.query(query_string2, [values], function(err,results){
                if (err) {
                    throw err;
                }  
            });
        });
    }


    // add log in Movie_Edits
    var now = new Date();
    var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    query_string = " INSERT INTO Movie_Edits SET ? ON DUPLICATE KEY UPDATE timestamp='"
        + timestamp + "'";
    var insert_info = { 
        timestamp: timestamp,
        uid: req.body.uid,
        mid: req.params.key
    }
    db.get().query(query_string, insert_info, function(err, results){
        if (err) throw err;
        res.status(200).send();
    });
});

router.post("/new", function(req, res, next) {

    var update_info = Object.assign({},req.body);
    delete update_info["uid"];
    delete update_info["genres"];
    delete update_info["actors"];
    delete update_info["director"];
    delete update_info["keywords"];

    var request_key = req.params.key;

    async.waterfall([
        function(callback){
            var actors = req.body.actors.split(",");
            query_string = "SELECT aid, name from Actors where name=\"" + actors[0] + "\"";
            for (var i=1; i < actors.length; i++){
                query_string += " OR name=\"" + actors[i] + "\"";
            }
            // find all actors
            db.get().query(query_string,function(err,rows,fields){
                if (err) {
                    throw err;
                }  

                // invalid actor names
                if (rows.length < actors.length){
                    callback("Invalid actors listed!");
                }

                callback(null,rows);
            });
        },
        function(aid,callback){
            var director = req.body.director;
            query_string = "SELECT did, name from Directors where name=\"" + director + "\"";
            db.get().query(query_string,function(err,rows,fields){
                if (err) {
                    throw err;
                }  

                // invalid director names
                if (rows.length <= 0){
                    callback("Invalid director listed!");
                }

                callback(null,aid,rows[0].did);
            });
        },
        function(aid,did,callback){
            var query_string = "INSERT INTO Movies SET ?";
            db.get().query(query_string, update_info, function(err, results){
                callback(null,aid,did,results.insertId.toString());
            });
        },
        function(aid,did,mid,callback){
            var query_string = "INSERT INTO Movie_Keywords (mid,keyword) VALUES ?";
            var values = [];
            req.body.keywords.split(",").forEach( function(k){
                values.push([ mid, k]);
            });
            db.get().query(query_string, [values], function(err,results){
                if (err) {
                    throw err;
                }  
                callback(null,aid,did,mid);
            });
        },
        function(aid,did,mid,callback){
            var query_string = "INSERT INTO Genres (mid,name) VALUES ?";
            var values = [];
            req.body.genres.split(",").forEach( function(g){
                values.push([ mid, g]);
            });
            db.get().query(query_string, [values], function(err,results){
                if (err) {
                    throw err;
                }  
                callback(null,aid,did,mid);
            });
        },
        function(aid,did,mid, callback){
            var values =[];
            aid.forEach( function(actor){
                values.push([ mid, actor.aid]);
            });

            query_string = "INSERT INTO Actor_Movie (mid,aid) VALUES ?";
            db.get().query(query_string, [values], function(err,results){
                if (err) {
                    throw err;
                }
                callback(null,aid,did,mid);
            });
        },
        function(aid,did,mid, callback){
            query_string = "INSERT INTO Director_Movie SET ?";
            var insert_data = {
                did: parseInt(did),
                mid: parseInt(mid)
            }
            db.get().query(query_string, insert_data, function(err,results){
                if (err) {
                    throw err;
                }
                callback(null);
            });
        },
    ], function(err,results){
        if (err) throw err;
        res.status(400).send();
    });
    res.status(200).send();
});

router.post("/delete/:key", function(req, res, next) {
    var query_string = "DELETE FROM Movies WHERE mid=" + req.body.mid;
    db.get().query(query_string, function(err, results){
        if (err) throw err;
        res.status(200).send();
    });
});

router.post('/rating_history/:key', function(req,res,next){
    var query_string = "SELECT M.movie_title as 'name', M.image_url, MR.rating, MR.comments, MR.timestamp, U.username"
        + " FROM Movies M, Movie_Ratings MR, Users U WHERE MR.mid=M.mid AND U.uid=MR.uid"
        + " AND M.mid=" + req.params.key + " ORDER BY timestamp DESC";
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
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
