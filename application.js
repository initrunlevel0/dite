/**
 * dité: Process based shared web hosting
 *
 * application.js
 * Web based application access for every user
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var express = require('express');
//var socketio = require('socket.io');
var http = require('http');
var net = require('net');

// Internal library requirement
var userManager = require('./userManager');
var database = require('./database');
var appManager = require('./appManager');

var app = express();
app.configure(function() {
    app.use(express.static(__dirname));
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.set('views', __dirname)
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'This is just some random secret key'
    }));
    app.use(express.static('bower_components'));
    app.use(express.static('app_static'));
});

//var server = http.createServer(app);
//var io = socketio.listen(server);
//server.listen(3000);

app.get('/', function(req, res) {
    res.redirect('/login');
});

app.get('/login', function(req, res) {
    res.render('login.ejs');
});


app.post('/login', function(req, res) {
    var userName = req.body.userName;
    var password = req.body.password;

    userManager.authUser(userName, password, function(err) {
        if(err) {
            res.redirect('/login');
            return;
        } else {
            req.session.isLogin = 1;
            req.session.userName = userName;
            res.redirect('/app');
        }
    })
});

app.get('/logout', function(req, res) {
    req.session = {};
    res.redirect('/login');
});

// /app middleware to protect
var requireAuthentication = function(req, res, next) {
    if(req.session.isLogin == 1) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.all('/app', requireAuthentication, function(req, res, next) {
    next();
});

app.all('/api/*', requireAuthentication, function(req, res, next) {
    next();
});


app.get('/app', function(req, res) {
    // This is AngularJS based app
    res.render('dasbor.ejs', {userName: req.session.userName});
});

// REST API
// User application data
app.get('/api/aplikasi', function(req, res) {
    // Get user data
    var applications = [];
    database.getUser(req.session.userName, function(err, resultUser) {
        if(!err) {
            resultUser.applications.forEach(function(application) {
                applications.push(application);
            })
            res.send(applications);
        }
    });
});

app.get('/api/aplikasi/:appName', function(req, res) {
    database.getUser(req.session.userName, function(err, resultUser) {
        if(!err) {
            resultUser.applications.forEach(function(application) {
                if(application.systemUserName == req.params.appName) {
                    res.send(application);
                }
            })
        }
    });
});

app.post('/api/aplikasi', function(req, res) {
    res.setHeader("Content-Type", "application/json");

    // Create new application
    var input = req.body;
    appManager.newApplication(req.session.userName, input.applicationName, input.applicationType, input.sshPublicKey, input.dnsCname, function(err, applicationData) {
        if(err) res.end(JSON.stringify({error: err}));
        else res.end(JSON.stringify(applicationData));
    });
});

app.put('/api/aplikasi', function(req, res) {
    var input = req.body;
    appManager.editApplication(req.session.userName, input.applicationName, input.sshPublicKey, input.dnsCname, function(err) {
        if(err) res.send({error: err});
        else res.send(applicationData);
    });
});

// Application Control
app.get('/api/control/:appName/:command', function(req, res) {
    res.setHeader("Content-Type", "application/json");
    database.getUser(req.session.userName, function(err, resultUser) {
        if(!err) {
            resultUser.applications.forEach(function(application) {
                if(application.systemUserName == req.params.appName) {
                    var command = {
                        cmd: req.params.command,
                        appData: application
                    }
                    var clientDaemon = net.connect({port:50000});
                    clientDaemon.write(JSON.stringify(command));
                    clientDaemon.on('data', function(data) {
                        res.write(data.toString());
                    });
                    clientDaemon.on('end', function() {
                        res.end();
                        clientDaemon.end();
                    });
                }
            })
        }
    });
});


app.listen(3000);
