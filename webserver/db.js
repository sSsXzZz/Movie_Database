var mysql = require('mysql')
  , async = require('async')

var PRODUCTION_DB = 'app_prod_database'
  , TEST_DB = 'app_test_database'

var state = {
  pool: null,
}

exports.connect = function(callback) {
    state.pool = mysql.createPool({
        host: 'us-cdbr-iron-east-04.cleardb.net',
        user: 'bb0c7ff2a4027d',
        password: 'f152a9b0',
        database: 'heroku_ba9f20b2b2fb039',
    })

    callback()
}

exports.get = function() {
    return state.pool
}
