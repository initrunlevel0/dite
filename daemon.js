/**
 * dité: Process based shared web hosting
 *
 * daemon.js
 * Daemon to start/stop/monitor all application
 * Communicate via Socket.IO port 1200
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var appManager = require('./appManager');
var userManager = require('./userManager');
var nginxConfigurator = require('./nginxConfigurator');
var net = require('net');
var childProcess = require('child_process');
var fs = require('fs');

var theProcess = {};
var theStatus = {};
var designatedPort = 10000;
var startApplication = function(appData) {
    var logStream = fs.createWriteStream(__dirname + '/log/' + appData.systemUserName + '.log', { flags: 'w', encoding: 'utf8'});
    logStream.write('Initializing app: ' + appData.systemUserName + '\n');

    // Create/Rewrite NGINX configuration
    logStream.write('Configuring nginx for domain ' + appData.dnsCname + '\n');
    nginxConfigurator.createNginxConfig(designatedPort, appData.dnsCname, function() {
        nginxConfigurator.reloadNginx();

        // Switch per applicationType
        switch(appData.applicationType) {
            case "node":
                var nodeAppConfigurator = require('./nodeAppConfigurator');

                // npm install
                logStream.write('Running npm install\n');
                nodeAppConfigurator.gettingReadyApp(appData.systemHomeDir, parseInt(appData.systemUID), parseInt(appData.systemGID), logStream, function(err) {
                    logStream.write('npm install done\n');
                    // Start the application, first time
                    theProcess[appData.systemUserName] = childProcess.spawn('node', ['app.js'], {
                        cwd: appData.systemHomeDir + '/app',
                        uid: parseInt(appData.systemUID),
                        gid: parseInt(appData.systemGID),
                        env: {
                            DITE_PORTNUM: designatedPort
                        }
                    });

                    theStatus[appData.systemUserName] = true;

                    // Increment designatedPort
                    designatedPort++;

                    logStream.write('Spawning app.js Node application for domain ' + appData.dnsCname + '\n');

                    // Register process event
                    theProcess[appData.systemUserName].on('exit', function() {
                        // Respawn, Unimplemented
                        logStream.write('app.js EXITED, NO RESPAWNER YET :(\n');
                        theStatus[appData.systemUserName] = false;
                    });

                    // Open log file
                    theProcess[appData.systemUserName].stdout.on('data', function(stream) {
                        logStream.write('app.js STDOUT: '+ stream.toString() + '\n');
                    });

                    theProcess[appData.systemUserName].stderr.on('data', function(stream) {
                        logStream.write('app.js STDERR: '+ stream.toString() + '\n');
                    });

                    theProcess[appData.systemUserName].on('error', function(err) {
                        logStream.write('Error happends with app.js: '+ err.toString() + '\n');
                    });

                })
                break;
        }

    })


};

var stopApplication = function(appData, callback) {
    if(theProcess[appData.systemUserName]) {
        theProcess[appData.systemUserName].kill('SIGTERM');
        if(callback) callback();
    }
}

var restartApplication = function(appData) {
    stopApplication(appData, function() {
        startApplication(appData);
    });
};

var getApplicationStatus = function(appData, callback) {
    callback(theStatus[appData.systemUserName]);
};


// MAIN APPLICATION
userManager.getAllUsers(function(err, users) {
    for (var i in users) {
        for(var j in users[i].applications) {
            // Per application, let's go
            var appData = users[i].applications[j];
            console.log(appData);
            startApplication(appData);
        }
    }
});

// SOCKET CONNECTION
var daemonServer = net.createServer(function(sock) {
    console.log('Connected with daemon Client')
    sock.on('data', function(buf) {
        console.log('Daemon get command: ' + buf.toString());
        var command = JSON.parse(buf.toString());
        if(command.cmd == "start") {
            startApplication(command.appData);
            sock.write(JSON.stringify({}));
        } else if(command.cmd == "stop") {
            stopApplication(command.appData);
            sock.write(JSON.stringify({}));
        } else if(command.cmd == "restart") {
            restartApplication(command.appDara);
            sock.write(JSON.stringify({}));
        } else if(command.cmd == "status") {
            getApplicationStatus(command.appData, function(result) {
                sock.write(JSON.stringify({result: result}));
            })
        }
    });
});

daemonServer.listen(50000);
