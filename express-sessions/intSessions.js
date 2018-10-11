var express = require('express');
var request = require('request');
var credentials = require('./credentials.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'SuperSecretPassword'}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9419);

//check for and set up session if needed
app.get('/',function(req,res,next){
  var ctx = {};
  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', ctx);
    return;
  }
  ctx.name = req.session.name;
  ctx.toDoCount = req.session.toDo.length || 0;
  ctx.toDo = req.session.toDo || [];
  console.log(ctx.toDo);
  res.render('toDo',ctx);
});


app.post('/',function(req,res){
  var context = {};

  if(req.body['New List']){
    req.session.name = req.body.name;
    req.session.toDo = [];
    req.session.curId = 0;
  }

  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', context);
    return;
  }


  if(req.body['Add Item']){
    var item = {"name":req.body.name,
                "zip":req.body.zip,
                "minTemp":req.body.temp,
                "id":req.session.curId,
                "city":"NULL",
                "cityTemp":"NULL",
                "validity":"NULL",
                };

    
    var zip = req.body.zip;
    var weatherBack = {}


    //make the API call to request the weather with the given ZIP
    request("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&APPID=" + credentials.owmKey, function(err,res,weather){

      if(!err && res.statusCode < 400){
        weatherBack = JSON.parse(weather.responsetext);
      }
      else{
        console.log(err);
        if(res){
          console.log(res.statusCode);
        }
      }
    });
  

    item.cityTemp = weatherBack.main.temp;
    item.city = weatherBack.name;

    //if temp is too low, set it
    if(item.cityTemp < item.minTemp){
      item.validity = "canDo";
    }
    else{
      item.validity = "noCanDo";
    }

    req.session.toDo.push(item);
    req.session.curId++;
  }


  if(req.body['Done']){
    req.session.toDo = req.session.toDo.filter(function(e){
      return e.id != req.body.id;
    })
  }

  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length;
  context.toDo = req.session.toDo;

  console.log(context.toDo);
  res.render('toDo',context);
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
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
