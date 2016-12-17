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
    var query_string = "SELECT M.*, A.name as \"actor_name\", A.aid, A.image_url as \"actor_url\", D.name as \"director_name\", D.did, D.image_url as \"director_url\", G.name as \"genre\", K.keyword " 
    + "FROM Movies M, Actors A, Actor_Movie AM, Directors D, Director_Movie DM, Genres G, Movie_Keywords K " 
    + "WHERE M.mid=" + moviekey + " AND AM.mid=" + moviekey + " AND A.aid=AM.aid" + " AND DM.mid=" + moviekey + " AND D.did=DM.did" + " AND G.mid=" + moviekey + " AND K.mid=" + moviekey;
    db.get().query(query_string,function(err,rows, fields){
        if (err) throw err;
        if (rows <= 0){
            res.status(400).send("Couldn't load all the information for the movie!");
            return;
        }
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
        res.render('movie_detail.ejs', {
            data: rows[0],
            actors: actors,
            director: director,
            genres: genres,
            keywords: keywords,
        });
    });
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
        db.get().beginTransaction(function(err){
            if (err) throw err;

            query_string = "DELETE FROM Movie_Keywords where mid=" + request_key;
            db.get().query(query_string, function(err,results){
                if (err) {
                    return db.get().rollback(function() {
                        throw err;
                    });
                }  

                var query_string2 = "INSERT INTO Movie_Keywords (mid,keyword) VALUES ?";
                var values = [];
                req.body.keywords.split(",").forEach( function(k){
                    values.push([ parseInt(request_key), k]);
                });
                db.get().query(query_string2, [values], function(err,results){
                    if (err) {
                        return db.get().rollback(function() {
                            throw err;
                        });
                    }  
                    db.get().commit(function(err){
                        if (err) {
                            return db.get().rollback(function(){
                                throw err;
                            });
                        }
                    });
                });
            });
        });
    }

    // Update Actors
    var actors = req.body.actors.split(",");
    if( actors.length > 0){
        db.get().beginTransaction(function(err){
            if (err) throw err;

            query_string = "DELETE FROM Actor_Movie where mid=" + request_key;
            db.get().query(query_string, function(err,results){
                if (err) {
                    return db.get().rollback(function() {
                        throw err;
                    });
                }  

                query_string = "SELECT aid, name from Actors where name=\"" + actors[0] + "\"";
                for (var i=1; i < actors.length; i++){
                    query_string += " OR name=\"" + actors[i] + "\"";
                }
                // find all actors
                db.get().query(query_string,function(err,rows,fields){
                    if (err) {
                        return db.get().rollback(function() {
                            throw err;
                        });
                    }

                    // invalid actor names
                    if (rows.length < actors.length){
                        return db.get().rollback(function() {
                        });
                    }
                    query_string = "INSERT INTO Actor_Movie (mid,aid) VALUES ?";
                    var values =[];
                    rows.forEach( function(actor){
                        values.push([ parseInt(request_key), actor.aid]);
                    });
                    // Insert new actors into db
                    db.get().query(query_string, [values], function(err,results){
                        if (err) {
                            return db.get().rollback(function() {
                                throw err;
                            });
                        }
                        db.get().commit(function(err){
                            if (err) {
                                return db.get().rollback(function(){
                                    throw err;
                                });
                            }
                        });
                    });
                });
            });
        });
    }

    // Update Director
    var director = req.body.director;
    if( director.length > 0 ){
        db.get().beginTransaction(function(err){
            if (err) throw err;

            query_string = "DELETE FROM Director_Movie where mid=" + request_key;
            db.get().query(query_string, function(err,results){
                if (err) {
                    return db.get().rollback(function() {
                        throw err;
                    });
                }
                console.log("TEST");
                console.log(results);

                query_string = "SELECT did, name from Directors where name=\"" + director + "\"";

                // find all directors
                db.get().query(query_string,function(err,rows,fields){
                    if (err) {
                        return db.get().rollback(function() {
                            throw err;
                        });
                    }
                    // invalid director name
                    if (rows.length <= 0){
                        return db.get().rollback(function() {
                        });
                    }
                    console.log("TEST2");
                    console.log(rows);
                    query_string = "INSERT INTO Director_Movie SET ? ON DUPLICATE KEY UPDATE"
                        + " did=" + rows[0].did;
                    var insert_value ={
                        did: rows[0].did,
                        mid: request_key,
                    };

                    // Insert new director
                    db.get().query(query_string, insert_value, insert_value, function(err,results){
                        if (err) {
                            console.log("I GUESS WE GOT IT");
                            return db.get().rollback(function() {
                                throw err;
                            });
                        }
                        console.log(results);
                        db.get().commit(function(err){
                            if (err) {
                                return db.get().rollback(function(){
                                    throw err;
                                });
                            }
                        });
                    });
                });
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

function objectArrayIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

module.exports = router;
