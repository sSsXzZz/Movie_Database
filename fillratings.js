var mysql = require('mysql');

var db = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'vishnu1',
        database: 'imdb',
});

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
var sql1 = "INSERT INTO Movie_Ratings (mid, uid, rating, comments, timestamp) VALUES ?";
var sql2 = "INSERT INTO Actor_Ratings (aid, uid, rating, comments, timestamp) VALUES ?";
var sql3 = "INSERT INTO Director_Ratings (did, uid, rating, comments, timestamp) VALUES ?";

var comments1 = ["I really like this movie","My son really enjoyed this movie","A family movie indeed","Bravo!","Impeccable character progression","Ingenious movie direction",
"Not appropriate for the whole family","Too Romanticized","Kids didn't enjoy the movie","The director should go back to director school"];

var comments2 = ["I really like this actor","My children really love this actor","An amazing actor indeed","Bravo!","Very good-looking","Excellent at bringing the role to life",
"Raunchy","Not a fan of the overreactions","Really poor actor","Hope this actor can find a better director!"];

var comments3 = ["I really like this director","My children really love this director's movies","An amazing director indeed","Bravo!","Very intelligent","Excellent at bringing the story to life",
"Not a family-friendly director","Not a fan of the over-the-top action","Really poor director","Hope this director can obtain better resources!"];

var entry1 = [];
var entry2 = [];
var entry3 = [];
for (var i = 0;i < 5043;i++) {
    for (var j = 0;j < 5;j++) {
        var temp1 = [];
        temp1.push(i+1, j+1,(Math.floor(Math.random()*5)+1),comments[Math.floor(Math.random()*comments.length)],randomDate(new Date(2012, 0, 1), new Date()));
        entry1.push(temp1);
    }
}
for (var i = 0;i < 6256;i++) {
    for (var j = 0;j < 5;j++) {
        var temp2 = [];
        temp2.push(i+1, j+1,(Math.floor(Math.random()*5)+1),comments2[Math.floor(Math.random()*comments2.length)],randomDate(new Date(2012, 0, 1), new Date()));
        entry2.push(temp2);
    }
}
for (var i = 0;i < 2399;i++) {
    for (var j = 0;j < 5;j++) {
        var temp3 = [];
        temp3.push(i+1, j+1,(Math.floor(Math.random()*5)+1),comments3[Math.floor(Math.random()*comments3.length)],randomDate(new Date(2012, 0, 1), new Date()));
        entry3.push(temp3);
    }
}

db.query(sql1, [entry1], function (err,result){
    if (err) throw err;
});
db.query(sql2, [entry2], function (err,result){
    if (err) throw err;
});
db.query(sql3, [entry3], function (err,result){
    if (err) throw err;
});
