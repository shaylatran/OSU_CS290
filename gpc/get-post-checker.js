/*
** Author: Christopther Rico
** Date: 11/12/2017
*/


var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5031);


app.get('/', function(req,res){
  var getParams = [];
  for (var entry in req.query)
  {
    getParams.push({'name':entry,'value':req.query[entry]})
  }

  var context = {};
  context.list = getParams;
  context.type = 'GET';
  res.render('get-post', context);

});


app.post('/', function(req,res){
  var postParams = [];
  for (var p in req.body)
  {
    postParams.push({'name':p,'value':req.body[p]})
  }

  var context = {};
  context.list = postParams;
  context.type = 'POST';
  res.render('get-post', context);

});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on port' + app.get('port') + '; press Ctrl-C to terminate.');
});
