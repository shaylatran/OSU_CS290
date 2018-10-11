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
app.use('/delete', require('./delete.js'));
app.set('mysql', mysql);
app.set('port', 9149);


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

    var params = [];

    for (var i in rows)
    {
      var addItem =
      {
          id:rows[i].id,
          name:rows[i].name,
          reps:rows[i].reps,
          weight:rows[i].weight,
          date:rows[i].date,
          unit:rows[i].unit
      };

        params.push(addItem);
    }

    context.results = params;
    res.render('home', context);
    });
});

//insert values into the table
app.get('/insert',function(req,res,next)
{
  var context = {};
  mysql.pool.query("INSERT INTO `tdo` (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?,?,?,?,?)",
    [req.query.name,
     req.query.reps,
     req.query.weight,
     req.query.date,
     req.query.unit],
     function(err, result)
    {
      if(err)
      {
        next(err);
        return;
      }

      context.inserted = result.insertId
      res.send(JSON.stringify(context));
    });
});

app.get('/updateTable',function(req, res, next)
{
    var context = {};
    mysql.pool.query('SELECT * FROM `tdo` WHERE id=?',
    [req.query.id],
    function(err, rows, fields)
    {
      if(err)
      {
          next(err);
          return;
      }
      var param = [];

      for(var i in rows)
      {
         var addItem =
          {
           'name':rows[i].name,
           'reps':rows[i].reps,
           'weight':rows[i].weight,
           'date':rows[i].date,
           'lbs':rows[i].unit,
           'id':rows[i].id
          };

          param.push(addItem);
      }

      context.results = param[0];
      res.render('edit', context);
    });
});

///safe-update?id=1&name=The+Task&done=false
app.get('/updateCall',function(req,res,next)
{
    var context = {};
    mysql.pool.query("SELECT * FROM tdo WHERE id=?",
    [req.query.id],
    function(err, result)
    {
      if(err){
      next(err);
      return;
    }

    if(result.length == 1)
    {
        var curVals = result[0];
        mysql.pool.query('UPDATE `tdo` SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=?',
        [req.query.name || curVals.name,
         req.query.reps || curVals.reps,
         req.query.weight || curVals.weight,
         req.query.date || curVals.date,
         req.query.unit || curVals.unit,
         req.query.id],
         function(err, result)
         {
                if(err){
                    next(err);
                    return;
                }
                mysql.pool.query('SELECT * FROM tdo', function(err, rows, fields)
                {
                  if(err)
                  {
                    next(err);
                    return;
                  }

                  var params = [];

                  for (var i in rows)
                  {
                    var addItem =
                    {
                        id:rows[i].id,
                        name:rows[i].name,
                        reps:rows[i].reps,
                        weight:rows[i].weight,
                        date:rows[i].date,
                        unit:rows[i].unit
                    }

                      params.push(addItem);
                  }

                  context.results = params;
                  res.render('home', context);
                });
            });
        }
    });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS tdo", function(err){
    var createString = "CREATE TABLE tdo("+
        "id INT PRIMARY KEY AUTO_INCREMENT,"+
        "name VARCHAR(255) NOT NULL,"+
        "reps INT,"+
        "weight INT,"+
        "date VARCHAR(15),"+
        "unit VARCHAR(5))";
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
