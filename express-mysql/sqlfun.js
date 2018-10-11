var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'))
app.set('port', 9419);


//show exercises input to database
app.get('/', function(req, res, next)
{
  var context = {};
  mysql.pool.query('SELECT * FROM tdo', function(err, rows, fields)
  {
    if(err)
    {
      next(err);
      return;
    }

    row_data = {};
    row_data.tdo = [];
    for (var i in rows) 
    {
        workout = {};

        workout.id      = rows[i].id;
        workout.name    = rows[i].name;
        workout.reps    = rows[i].reps;
        workout.weight  = rows[i].weight;
        workout.date    = rows[i].date;
        workout.unit    = rows[i].unit;

        row_data.workouts.push(workout);
    }

    context.results = JSON.stringify(rows);
    context.data = row_data;

    res.render('home', context);
    });
});


//insert values into the table
app.get('/insert',function(req,res,next)
{
  var context = {};


  mysql.pool.query("INSERT INTO tdo (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?,?,?,?,?)", 
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.unit], function(err, result)
    {
      if(err)
      {
        next(err);
        return;
      }

     mysql.pool.query("SELECT * from tdo WHERE id=?", [result.insertId], function(err,result)
     {
      if(err)
      {
        next(err);
        reuturn;
      }

      res.send(JSON.stringify(result[0]));
    });
  });
});



//delete line item from database
app.get('/delete',function(req,res,next)
{
  var context = {};
  mysql.pool.query("DELETE FROM tdo WHERE id=?", [req.query.id], function(err, result)
  {
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows.";
    res.render('home',context);
  });
});


app.get('/edit', function(req, res, next)
{
  var context = {};

  mysql.pool.query("SELECT * FROM tdo WHERE id=?", [req.query.id], function(err, result)
  {
    if(err)
    {
      next(err);
      return;
    }

    context.id      = result[0].id;
    context.name    = result[0].name;
    context.weight  = result[0].weight;
    context.reps    = result[0].reps;
    context.date    = result[0].date;
    context.unit    = result[0].unit;

    res.render('edit', context);
  });
});


///safe-update?id=1&name=The+Task&done=false
app.get('/update',function(req,res,next)
{
    var context = {};

    mysql.pool.query("SELECT * FROM tdo WHERE id=?", [req.query.id], function(err, result)
    {
      if(err)
      {
          next(err);
          return;
      }

      if(result.length == 1)
      {
          var curVals = result[0];

          mysql.pool.query("UPDATE tdo SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=? ",
          [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight,
          req.query.date || curVals.date, req.query.unit || curVals.unit, req.query.id], function(err, result){
                  if(err){
                      next(err);
                      return;
                  }
                  mysql.pool.query('SELECT * FROM tdo', function(err, rows, fields){
                      if(err){
                          next(err);
                          return;
                      }

                      row_data = {};
                      row_data.workouts = [];
                      for (var i in rows) 
                      {
                          workout = {};

                          workout.id      = rows[i].id;
                          workout.name    = rows[i].name;
                          workout.reps    = rows[i].reps;
                          workout.weight  = rows[i].weight;
                          workout.date    = rows[i].date;
                          workout.unit    = rows[i].unit;

                          row_data.workouts.push(workout);
                      }

                      context.results = JSON.stringify(rows);
                      context.data = row_data;

                      res.render('home', context);
                  });
              });
          }
    });
});


app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS tdo", function(err)
  {
    var createString = "CREATE TABLE tdo(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
    "weight INT," +
    "date DATE," +
    "unit VARCHAR(3)");
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
