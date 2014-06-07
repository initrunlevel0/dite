/**
 * dité: Process based shared web hosting
 *
 * pamManager.js
 * Manage system based userName via PAM
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var childProcess = require('child_process');

module.exports.createUserAndGroup = function(userName, callback) {
    var uid = null;
    var gid = null;
    var userAddProcess = childProcess.spawn('adduser', ['--force-badname', '--disabled-password', '--gecos', "", userName]);
    userAddProcess.on('exit', function(code) {
        // Get UID
        var idUidProcess = childProcess.spawn('id', ['-u', userName]);
        idUidProcess.stdout.on('data', function(data) {
            uid = data.toString().replace('\n', '');
        });

        idUidProcess.on('close', function() {
            // Get GID
            var idGidProcess = childProcess.spawn('id', ['-g', userName]);

            idGidProcess.stdout.on('data', function(data) {
                gid = data.toString().replace('\n', '');
            });

            idGidProcess.on('close', function() {
                callback(null, parseInt(uid), parseInt(gid), '/home/' + userName);
            });
        });
    });
};
