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
        //var actors = rows.map(function(a) { return a.actor_name });
        var actors = [];
        var genres = [];
        var keywords = [];
        var director = {
            did: rows[0].did,
            name: rows[0].director_name,
            image_url: rows[0].image_url,
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
    if (req.body.keywords.length > 0){
        console.log( req.body.keywords.split(","));
        /*
        query_string = "DELETE FROM Movie_Keywords where mid=" + req.params.key;
        db.query(query_string, function(err,results){
            if (err) throw err;
        });
        */
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
