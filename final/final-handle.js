/*
** Author: Christopther Rico
** Date: 11/19/2017
*/


var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9531);


//homepage
app.get('/', function(req,res){
  var context = {};
  res.render('home', context);

});

//roster
app.get('/roster', function(req,res){
  var context = {};
  res.render('roster', context);

});

//art projects
app.get('/artProjects', function(req,res){
  var context = {};
  res.render('artProjects', context);

});

//resources
app.get('/burnerResources', function(req,res){
  var context = {};
  res.render('burnerResources', context);

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