var mysql = require('mysql');

var db = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'vishnu1',
        database: 'imdb',
});

var random_date = new Date(2015, 12, 25, 5, 32, 48);

var entry = {
    mid: 1,
    uid: 3,
    rating: 3,
    comments: "This movie is awesome!",
    timestamp: random_date,
};

db.query("INSERT INTO Movie_Ratings SET ?", entry, function (err,result){
    if (err) throw err;
});
