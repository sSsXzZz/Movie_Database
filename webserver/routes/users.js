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
            var user_info = rows[0];
            query_string = "SELECT 1 FROM Super_Users WHERE uid="
                + rows[0].uid
                + " limit 1";

            // check if they are a super user
            db.get().query(query_string, function(err, rows, fields){
                if (err) throw err;
                var user_object = {
                    id: user_info.uid.toString(),
                    username: user_info.username,
                }
                if (rows.length >= 0){
                    user_object["super_user"] = 1;
                }
                console.log("User " + req.body.username + " has logged in\n");
                res.status(200).send(user_object);
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

router.post('/change_password', function(req,res,next){
    if (!req.body.username || !req.body.old_pass || !req.body.new_pass){
        res.status(400).send('Please send all fields!');
    }
    var query_string = "SELECT uid FROM Users WHERE "
        + "username='" + req.body.username + "' AND password='" + req.body.old_pass + "'";
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        if (rows.length <= 0){
            res.status(403).send('Invalid username or password!');
            return;
        }
        query_string = "UPDATE Users SET"
            + " password='" + req.body.new_pass + "' WHERE uid=" + rows[0].uid;
        db.get().query(query_string, function(err, results){
            if (err) throw err;
            res.status(200).send("Updated password!");
        });
    });
});

router.post('/rating_history', function(req,res,next){
    if (!req.body.uid){
        res.status(400).send('Not logged in!');
    }
    var query_string = "SELECT * FROM ("
        + " SELECT M.movie_title as 'name', M.image_url, MR.rating, MR.comments, MR.timestamp"
        + " FROM Movies M, Movie_Ratings MR"
        + " WHERE MR.uid=" + req.body.uid + " AND MR.mid=M.mid"
        + " UNION SELECT A.name, A.image_url, AR.rating, AR.comments, AR.timestamp"
        + " FROM Actors A, Actor_Ratings AR"
        + " WHERE AR.uid=" + req.body.uid + " AND AR.aid=A.aid"
        + " UNION SELECT D.name, D.image_url, DR.rating, DR.comments, DR.timestamp"
        + " FROM Directors D, Director_Ratings DR"
        + " WHERE DR.uid=" + req.body.uid + " AND DR.did=D.did"
        + " ) as history order by timestamp DESC limit 10";
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        res.send(rows);
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
    /*
    var query_string = "UPDATE Movie_Ratings SET"
    + " rating=" + rating + ", timestamp=\"" + timestamp + "\""
    + " WHERE mid=" + req.params.key + " AND uid=" + uid;
    */
    var query_string = "INSERT INTO Movie_Ratings SET ? "
        + "ON DUPLICATE KEY UPDATE rating=" + rating + ", timestamp='" + timestamp + "'";
    console.log(query_string);
    db.get().query(query_string,{
            uid: uid,
            mid: req.params.key,
            rating: rating,
            timestamp: timestamp,
        }, function(err,results){
            if (err){ 
                res.status(400).send("Error updating rating!");
                console.log(err);
                return;
            }
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
    var query_string = "INSERT INTO Movie_Ratings SET ? "
        + "ON DUPLICATE KEY UPDATE comments='" + comments + "', timestamp='" + timestamp + "'";
    db.get().query(query_string,{
            uid: uid,
            mid: req.params.key,
            timestamp: timestamp,
            comments: comments
        },function(err,results){
            if (err) res.status(400).send("Error updating rating!");
            res.status(200).send("Comments Updated!");
        });
});

router.post('/director_rating/:key',function(req, res, next){
    if (!req.body.uid){
        res.status(400).send("No uid given!");
        return;
    }
    var uid = req.body.uid;
    var query_string = "SELECT rating, comments "
    + "FROM Director_Ratings "
    + "WHERE did=" + req.params.key + " AND uid=" + uid;
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        res.status(200).send(rows[0]);
    });
});

router.post('/director_rating/update_rating/:key',function(req, res, next){
    if (!req.body.uid || !req.body.rating){
        res.status(400).send("No uid or rating given!");
        return;
    }
    var uid = req.body.uid;
    var rating = req.body.rating;
    var now = new Date();
    var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var query_string = "INSERT INTO Director_Ratings SET ? "
        + "ON DUPLICATE KEY UPDATE rating=" + rating + ", timestamp='" + timestamp + "'";
    db.get().query(query_string,{
            uid: uid,
            did: req.params.key,
            rating: rating,
            timestamp: timestamp,
        }, function(err,results){
            if (err){ 
                res.status(400).send("Error updating rating!");
                console.log(err);
                return;
            }
            res.status(200).send("Rating Updated!");
        });
});

router.post('/director_rating/update_comments/:key',function(req, res, next){
    if (!req.body.uid || !req.body.comments){
        res.status(400).send("No uid given or comments!");
        return;
    }
    var uid = req.body.uid;
    var comments = req.body.comments;
    var now = new Date();
    var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var query_string = "INSERT INTO Director_Ratings SET ? "
        + "ON DUPLICATE KEY UPDATE comments='" + comments + "', timestamp='" + timestamp + "'";
    db.get().query(query_string,{
            uid: uid,
            did: req.params.key,
            timestamp: timestamp,
            comments: comments
        },function(err,results){
            if (err) res.status(400).send("Error updating rating!");
            res.status(200).send("Comments Updated!");
        });
});

router.post('/actor_rating/:key',function(req, res, next){
    if (!req.body.uid){
        res.status(400).send("No uid given!");
        return;
    }
    var uid = req.body.uid;
    var query_string = "SELECT rating, comments "
    + "FROM Actor_Ratings "
    + "WHERE aid=" + req.params.key + " AND uid=" + uid;
    db.get().query(query_string, function(err,rows,fields){
        if (err) throw err;
        res.status(200).send(rows[0]);
    });
});

router.post('/actor_rating/update_rating/:key',function(req, res, next){
    if (!req.body.uid || !req.body.rating){
        res.status(400).send("No uid or rating given!");
        return;
    }
    var uid = req.body.uid;
    var rating = req.body.rating;
    var now = new Date();
    var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var query_string = "INSERT INTO Actor_Ratings SET ? "
        + "ON DUPLICATE KEY UPDATE rating=" + rating + ", timestamp='" + timestamp + "'";
    db.get().query(query_string,{
            uid: uid,
            aid: req.params.key,
            rating: rating,
            timestamp: timestamp,
        }, function(err,results){
            if (err){ 
                res.status(400).send("Error updating rating!");
                console.log(err);
                return;
            }
            res.status(200).send("Rating Updated!");
        });
});

router.post('/actor_rating/update_comments/:key',function(req, res, next){
    if (!req.body.uid || !req.body.comments){
        res.status(400).send("No uid given or comments!");
        return;
    }
    var uid = req.body.uid;
    var comments = req.body.comments;
    var now = new Date();
    var timestamp = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    var query_string = "INSERT INTO Actor_Ratings SET ? "
        + "ON DUPLICATE KEY UPDATE comments='" + comments + "', timestamp='" + timestamp + "'";
    db.get().query(query_string,{
            uid: uid,
            aid: req.params.key,
            timestamp: timestamp,
            comments: comments
        },function(err,results){
            if (err) res.status(400).send("Error updating rating!");
            res.status(200).send("Comments Updated!");
        });
});

function addNewUser(user_object,res){
    db.get().query("INSERT INTO Users SET ?", user_object, function(err,result){
            if (err) throw err;
            res.status(200).send({
                id: result.insertId.toString(),
                username: user_object.username,
            });
    });
}

module.exports = router;
