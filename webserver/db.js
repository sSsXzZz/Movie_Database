var mysql = require('mysql')
  , async = require('async')

var PRODUCTION_DB = 'app_prod_database'
  , TEST_DB = 'app_test_database'

var state = {
  pool: null,
}

exports.connect = function(callback) {
    state.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'vishnu1',
        database: 'imdb',
    })

    callback()
}

exports.get = function() {
    return state.pool
}
