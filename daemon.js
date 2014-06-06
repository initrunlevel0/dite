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
var childProcess = require('./child_process');

var theProcess = {};
userManager.getAllUsers(function(users) {
    var designatedPort = 10000;
    for (var i in users) {
        for(var j in users[i].applications) {
            // Per application, let's go
            var appData = users[i].applications[j];
            // Create/Rewrite NGINX configuration
            nginxConfigurator.createNginxConfig(designatedPort, appData.dnsCname, function() {
                // Switch per applicationType
                switch(appData.applicationType) {
                    case "node":
                        var nodeAppConfigurator = require('./nodeAppConfigurator');
                        // npm install
                        nodeAppConfigurator.gettingReadyApp(appData.systemHomeDir, systemUID, systemGID, function() {
                            // Start the application, first time
                            theProcess[appData.systemUserName] = childProcess.spawn('node', ['app.js'], {
                                cwd: appData.systemHomeDir + '/app',
                                uid: appData.systemUID,
                                gid: appData.systemGID,
                                env: {
                                    DITE_PORTNUM: designatedPort
                                }
                            });
                            // Register process event
                            theProcess[appData.systemUserName].on('exit', function() {
                                // Respawn, Unimplemented
                            });
                            // Open log file
                            var logStream = fs.createWriteStream(__dirname + '/log/' + appData.systemUserName + '.log');
                            theProcess[appData.systemUserName].stdout.on('data', function(stream) {
                                logStream.write('app.js STDOUT: ', stream.toString());
                            });
                            theProcess[appData.systemUserName].stderr.on('data', function(stream) {
                                logStream.write('app.js STDERR: ', stream.toString());
                            });
                        })
                        break;
                }

                // Increment designatedPort
                designatedPort++;
            })


        }
    }
});

// Socket IO communication implementation
// Unimplemented
