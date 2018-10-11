var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_ricoch',
  password        : '9746',
  database        : 'cs290_ricoch'
});

module.exports.pool = pool;
