/**
 * dité: Process based shared web hosting
 *
 * gitConfigurator.js
 * GIT Repository Configurator
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var childProcess = require('child_process')
var fs = require('fs');
var writeSshPublicKey = function(homeDir, sshPublicKey, uid, gid, callback) {
    fs.writeFile(homeDir + '/.ssh/authorized_keys', sshPublicKey, function(err) {
        var chown = childProcess.spawn('chown', [uid + ':' + gid, '-R', homeDir + '/.ssh']);
        chown.on('exit', function() {
            callback();
        });
    });
}

module.exports.writeSshPublicKey = writeSshPublicKey;

module.exports.configureApp = function(homeDir, sshPublicKey, uid, gid, callback) {
    // Step by step to configure
    // 1. Create ~/.ssh directory
    fs.mkdir(homeDir + '/.ssh', function(err) {
        // Create file /.ssh/authorized_keys
        writeSshPublicKey(homeDir, sshPublicKey, uid, gid, function() {
            if(err) callback(err);
            else {
                if(err) callback(err);
                else {
                    // Create app.git directory
                    fs.mkdir(homeDir + '/app.git', function(err) {
                        // "git init --bare"
                        var gitInit = childProcess.spawn('/usr/bin/git', ['init', '--bare'], { cwd: homeDir + '/app.git'})
                        gitInit.stdout.on('data', function(data) { console.log(data.toString() )})
                        gitInit.on('exit', function(code, signal) {
                            // "git clone app.git"
                            var gitClone = childProcess.spawn('/usr/bin/git', ['clone', 'app.git'], { cwd: homeDir});
                            gitClone.on('exit', function(code, signal) {
                                // Finally, chown all directory to this user
                                var chown = childProcess.spawn('chown', [uid + ':' + gid, '-R', homeDir + '/app.git', homeDir + '/app']);
                                chown.on('exit', function(code, signal) {
                                    callback(null);
                                });
                            })
                        })
                    })

                }

            }
        });

    })
}
