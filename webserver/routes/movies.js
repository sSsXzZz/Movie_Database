var express = require('express');
var router = express.Router();
var db = require('../db');

/*
router.get('/', function(req, res, next) {
    res.render('movie_detail.ejs');
});
*/

router.get('/a', function(req, res, next) {
    res.render('movie_detail.ejs');
});

module.exports = router;
