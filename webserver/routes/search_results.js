var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res, next) {
    var multiple_tables=false; //flag for if we are querying multiple tables
    var valid_query = false;
    var sql_query;
    sql_query = "SELECT * FROM ( ";
    for ( var param in req.query){
        if ( (param==="Movies" || param==="Actors" || param ==="Directors") && req.query[param] ==='true'){
            valid_query=true;
            var id_field;
            var name_field;
            if (param ==="Movies"){
                id_field = "mid";
                name_field = "movie_title";
            } else if (param ==="Actors"){
                id_field = "aid";
                name_field = "name";
            } else{ //Directors
                id_field = "did";
                name_field = "name";
            }
            sql_query += ( multiple_tables ? " UNION " : "")
                + "SELECT "
                + name_field
                + ( name_field ==="movie_title" ? " AS name" : "")
                + ", \"" + param + "\" as source"
                + ", " + id_field + " as id"
                + ", image_url"
                + " FROM " +  param
                + " WHERE " + name_field
                + " LIKE \"%" + req.query['q'] + "%\"";
            multiple_tables = true;
        }
    }
    sql_query += " ) AS search_results ORDER BY name";
    console.log(sql_query);
    if(valid_query){
        db.get().query(sql_query, function (err, rows, fields){
            if (err) throw err;
            res.render('search_results', {title: 'Search Results', entries: rows});
        });
    } else {
        res.status(400).send("Invalid search request!");
    }
});

module.exports = router;
