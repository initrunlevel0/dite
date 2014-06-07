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
var childProcess = require('child_process');
var fs = require('fs');

var theProcess = {};
userManager.getAllUsers(function(err, users) {
    var designatedPort = 10000;
    for (var i in users) {
        for(var j in users[i].applications) {
            // Per application, let's go
            var appData = users[i].applications[j];
            console.log(appData);

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

                            // Increment designatedPort
                            designatedPort++;

                            logStream.write('Spawning app.js Node application for domain ' + appData.dnsCname + '\n');

                            // Register process event
                            theProcess[appData.systemUserName].on('exit', function() {
                                // Respawn, Unimplemented
                                logStream.write('app.js EXITED, NO RESPAWNER YET :(\n');
                            });

                            // Open log file
                            theProcess[appData.systemUserName].stdout.on('data', function(stream) {
                                logStream.write('app.js STDOUT: '+ stream.toString());
                            });

                            theProcess[appData.systemUserName].stderr.on('data', function(stream) {
                                logStream.write('app.js STDERR: '+ stream.toString());
                            });

                        })
                        break;
                }

            })


        }
    }
});

// Socket IO communication implementation
// Unimplemented
