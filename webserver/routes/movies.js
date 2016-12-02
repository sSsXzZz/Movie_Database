var express = require('express');
var router = express.Router();
var db = require('../db');

router.get("/:key", function(req, res, next) {
    var moviekey = parseInt(req.params.key, 10);
    if (!Number.isInteger(moviekey)){
        res.status(400).send("Requested movie does not exist!");
        return;
    }
    var query_string = "SELECT M.*, A.name as \"actor_name\", D.name as \"director_name\", G.name as \"genre\", K.keyword " 
    + "FROM Movies M, Actors A, Actor_Movie AM, Directors D, Director_Movie DM, Genres G, Movie_Keywords K " 
    + "WHERE M.mid=" + moviekey + " AND AM.mid=" + moviekey + " AND A.aid=AM.aid" + " AND DM.mid=" + moviekey + " AND D.did=DM.did" + " AND G.mid=" + moviekey + " AND K.mid=" + moviekey;
    db.get().query(query_string,function(err,rows, fields){
        if (err) throw err;
        //var actors = rows.map(function(a) { return a.actor_name });
        var actors = [];
        var genres = [];
        var keywords = [];
        rows.forEach(function(entry){
            if (actors.indexOf(entry.actor_name) === -1){
                actors.push(entry.actor_name);
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
            director: rows[0].director_name,
            genres: genres,
            keywords: keywords,
        });
    });
});

module.exports = router;
