module.exports = function()
{
  var express = require('express');
  var router = express.Router();

  router.delete('/:id', function(req, res)
  {
      var mysql = req.app.get('mysql');
      var sql = "DELETE FROM tdo WHERE id = ?";
      var inserts = [req.params.id];
      sql = mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.status(400);
              res.end();
          }else{
              res.status(202).end();
          }
      })
  });

  return router;
}();
