var express = require('express');
var router = express.Router();
var db = require('../db');
var dateFormat = require('dateformat');

router.post('/login', function(req,res,next){
    if (!req.body.username || !req.body.password){
        res.status(400).send('No username or password specified!');
    }
    var query_string = "SELECT uid, username FROM Users WHERE "
        + "username='" + req.body.username
        + "' AND password='" + req.body.password + "'";
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        if (rows.length < 1){
            res.status(403).send('Invalid credentials!');
        } else{
            console.log("User " + req.body.username + " has logged in\n");
            res.status(200).send({
                id: rows[0].uid.toString(),
                username: rows[0].username,
            });
        }
    });
});

router.post('/signup', function(req,res,next){
    if (!req.body.username || !req.body.password){
        res.status(400).send('No username or password specified!');
    }
    var query_string = "SELECT uid FROM Users WHERE "
        + "username='" + req.body.username + "'";
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        if (rows.length > 0){
            res.status(403).send('Username already taken!');
        } else{
            addNewUser({
                username: req.body.username,
                password: req.body.password,
            }, res);
            console.log("User " + req.body.username + " created!\n");
        }
    });
});

router.post('/movie_rating/:key',function(req, res, next){
    if (!req.body.uid){
        res.status(400).send("No uid given!");
        return;
    }
    var uid = req.body.uid;
    var query_string = "SELECT rating, comments "
    + "FROM Movie_Ratings "
    + "WHERE mid=" + req.params.key + " AND uid=" + uid;
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        res.status(200).send(rows[0]);
    });
});

router.post('/movie_rating/update_rating/:key',function(req, res, next){
    if (!req.body.uid || !req.body.rating){
        res.status(400).send("No uid or rating given!");
        return;
    }
    var uid = req.body.uid;
    var rating = req.body.rating;
    var now = new Date();
    var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var query_string = "UPDATE Movie_Ratings SET"
    + " rating=" + rating + ", timestamp=\"" + timestamp + "\""
    + " WHERE mid=" + req.params.key + " AND uid=" + uid;
    console.log(query_string);
    db.get().query(query_string, function(err,results){
        if (err) res.status(400).send("Error updating rating!");
        res.status(200).send("Rating Updated!");
    });
});

router.post('/movie_rating/update_comments/:key',function(req, res, next){
    if (!req.body.uid || !req.body.comments){
        res.status(400).send("No uid given or comments!");
        return;
    }
    var uid = req.body.uid;
    var comments = req.body.comments;
    var now = new Date();
    var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var query_string = "UPDATE Movie_Ratings SET"
    + " comments=\"" + comments + "\"" + ", timestamp=\"" + timestamp + "\""
    + " WHERE mid=" + req.params.key + " AND uid=" + uid;
    db.get().query(query_string, function(err,results){
        if (err) res.status(400).send("Error updating rating!");
        res.status(200).send("Comments Updated!");
    });
});

function addNewUser(user_object,res){
    db.get().query("INSERT INTO Users SET ?", user_object, function(err,result){
            if (err) throw err;
            console.log(result.insertId);
            res.status(200).send({
                id: result.insertId.toString(),
                username: user_object.username,
            });
    });
}

module.exports = router;
