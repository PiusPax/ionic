var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('map_server', ['users']);
var ObjectId = mongojs.ObjectId;


var app = express();

/*
var logger = function(req, res, next){
    console.log('Logging...');
    next();
}
app.use(logger);
*/

// view Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

// Express Validatior Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.get('/', (req, res) => {
    db.users.find((err, docs) => {
        res.render('index', {
            title: 'Display',
            users: docs
        });
    });
    //res.send('Hello World!');     // Sends a string element directly to the view!
    //res.json(people);             // Renders a created JSON object to view!
});

app.post('/', function(req, res){

    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();

    var errors = req.validationErrors();
    var users = [];
    if(errors){
        console.log('ERRORS');
        res.render('index', {
            title: 'Custom',
            users: users,
            errors: errors
        });
    }else{
        console.log('SUCCESS');
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        db.users.insert(newUser, (err, result) => {
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
    }
});

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log('Server Started on Port ' + port);
})