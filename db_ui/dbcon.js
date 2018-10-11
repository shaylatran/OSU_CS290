var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_ricoch',
  password        : '9746',
  database        : 'cs290_ricoch'
});

pool.query("DROP TABLE IF EXISTS tdo", function(err) {
   var createString = "CREATE TABLE tdo(" +
   "id INT PRIMARY KEY AUTO_INCREMENT," +
   "name VARCHAR(255) NOT NULL," +
   "reps INT," +
   "weight INT," +
   "unit VARCHAR(5)," +
   "date VARCHAR(15))";
   pool.query(createString, function(err) {
      if (err) console.log(err);
      console.log("tdo table created");
   });
});


module.exports.pool = pool;
