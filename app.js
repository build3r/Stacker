/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , StackerProvider = require('./stackerProvider').StackerProvider;
fs = require("fs")
crypto = require('crypto')
var flock = require('flockos');

flock.setAppId('72a32f3c-d976-4265-913b-b774921da25b');
flock.setAppSecret('7e5543af-c536-463b-aa35-76684cb2ccae');
/*var privateKey  = fs.readFileSync('./certs/key.pem', 'utf8');
var certificate = fs.readFileSync('./certs/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate, passphrase: 'Shabaz'};*/
var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(flock.eventTokenChecker);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var stackerProvider= new StackerProvider('localhost', 27017);
var token='bc02b456-e420-4d61-8236-27ab0d187259';
var userId = 'u:47wawv2v6a0a2787';
var botToken = "50ce74db-244f-4767-bfa4-1233ed3b0325";
//Routes
//Slash Command
app.post('/events', flock.router);
flock.events.on('app.install',function (event) {
    token = event.userToken;
    userId = event.userId;
    console.log("User token: "+token);
   // flock.verifyEventToken(req.x-flock-event-token);
    return '200';
});
flock.events.on('client.slashCommand', function (event) {
    stackerProvider.getAllLinks(function(error, links){
        if(error)
        {
            console.log("Error "+error.message);
            return {
                text: 'Error '+error.message
        }
        }
        else {
            console.log("Got Links "+links.toString());
            flock.callMethod('chat.sendMessage', botToken, {
                to: event.userId,
                text: 'List: '+links.toString()
            }, function (error, response) {
                if (!error) {
                    console.log("Response "+response);
                    return {
                        text: 'Returning : ' + links.length+" Documents"

                    }
                }
                else
                {
                    console.log("Error : "+error.message);
                }
            });
        }
    });


});
//saveLink
app.get('/saveLink',function (req, res) {
    var link = req.param('link');
    var userId = req.param('userId');
    var title = "How can I send a success status to browser from nodejs/express?";
    var description = "I've written the following piece of code in my nodeJS/Expressjs server:\nThis allows me to get the submitted form data and write it to a JSON file.\nThis works perfectly. But the client remains in some kind of posting state and eventually times out. So I need to send some kind of success state or success header back to the client.\nHow should I do this?\n        Thank you in advance!";
    var answer = "Express Update 2015:\nUse this instead:\nres.sendStatus(200)\nThis has been deprecated:\nres.send(200)";
    var tags = ['node.js','post','express'];
    stackerProvider.save({
        title: title,
        userId: userId,
        link: link,
        description: description,
        answer: answer,
        tags: tags

    }, function( error, docs) {
        if(error)
        {
            console.log("There was a error saving");

        }
        else
        {
            console.log("Document saved Successfully: "+docs);
            flock.callMethod('chat.sendMessage', botToken, {
                to: userId,
                text: 'Saved the Link: '+link
            }, function (error, response) {
                if (!error) {
                    console.log("Response "+response.statusCode);
                    return res.send('200');
                }
                else
                {
                    console.log("Error : "+error.message);
                }
            });
        }
    });


});

//Summary
app.get('/summary',function (req,res) {
    stackerProvider.getAllLinks(function(error, links){
        if(error)
        {
            console.log("Error "+error.message);
            return {
                text: 'Error '+error.message
            }
        }
        else {
            res.render('summary', {
                title: 'Stacker',
                links: links
            });
        }});

});
//Preview Link
app.get('/previewLink',function (req,res) {
    var link = req.param('link');
    flock.callMethod('chat.sendMessage', botToken, {
        to: userId,
        text: link
    }, function (error, response) {
        if (!error) {
            console.log("Response "+response.statusCode);
            res.redirect('/summary')
        }
        else
        {
            console.log("Error : "+error.message);
        }
    });
});
//index
app.get('/', function(req, res){
   /* stackerProvider.bulk(function(error, list){
        if(error)
        {
            console.log("Error "+error.message);
            return {
                text: 'Error '+error.message
            }
        }
        else {
            console.log("Saved "+list.length+ " Documents");
        }});*/
    res.render('index',{
        title:'Stacker',
        employess: []
    });
  /*employeeProvider.findAll(function(error, emps){
      if(error)
      {
         console.log("Error "+error.message);
      }
      else {
          res.render('index', {
              title: 'Employees',
              employees: emps
          });
      }
  });*/
});




/*//new employee
app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an employee
app.get('/employee/:id/edit', function(req, res) {
	employeeProvider.findById(req.param('_id'), function(error, employee) {
		res.render('employee_edit',
		{ 
			title: employee.title,
			employee: employee
		});
	});
});

//save updated employee
app.post('/employee/:id/edit', function(req, res) {
	employeeProvider.update(req.param('_id'),{
		title: req.param('title'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an employee
app.post('/employee/:id/delete', function(req, res) {
	employeeProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});*/
//var httpsServer = https.createServer(credentials, app);
app.listen(process.env.PORT || 3000);
