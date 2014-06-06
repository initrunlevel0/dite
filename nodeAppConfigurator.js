/**
 * dité: Process based shared web hosting
 *
 * nodeAppConfigurator.js
 * Node JS Based Web Application Configurator
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var childProcess = require('child_process');
var fs = require('fs-extra');

module.exports.configureApp = function(homeDir, uid, gid, callback, callbackError) {
    // Step by step to configure
    // Commit a node.js based sample apps from sample/node
    fs.copy(__dirname + "/sample/node", homeDir + '/app', function(err) {
        var chown = childProcess.spawn('chown', [uid + ':' + gid, '-R', homeDir + '/app']);
        chown.on('exit', function(code, signal) {
            // Add File, Commit, Push
            var gitAddFile = childProcess.spawn('git', ['add', '-A'], {cwd: homeDir + '/app', uid:uid, gid:gid});
            gitAddFile.on('exit', function() {
                var gitCommit = childProcess.spawn('git', ['commit', '-m', 'Initial Sample Commit'], {cwd: homeDir + '/app', uid: uid, gid: gid})
                gitCommit.on('exit', function() {
                    var gitPush = childProcess.spawn('git', ['push', 'origin', 'master'], {cwd: homeDir + '/app', uid:uid, gid:gid})
                    gitPush.on('exit', function() {
                        callback();
                    });
                });
            });
        });
    });
}

module.exports.gettingReadyApp = function(homeDir, uid, gid, callback, callbackError) {
    // npm install the directory
    var npm = childProcess.spawn('npm', ['install'], { cwd: homeDir + '/app', uid: uid, gid: gid});
    npm.on('exit', function(code, signal) {
        if(code != 0) {
            callbackError();
        } else {
            callback();
        }
    })
}

module.exports.readPackageJson = function(homeDir, callback) {
    fs.readFile(homeDir + '/app/package.json', function(err, data) {
        callback(JSON.parse(data));
    });
}
