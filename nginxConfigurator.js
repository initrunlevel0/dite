/**
 * dité: Process based shared web hosting
 *
 * nginxConfigurator.js
 * NGINX Configuration per Application
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var fs = require('fs');
var childProcess = require('child_process');

module.exports.createNginxConfig = function(port, cname, callback, callbackError) {
    var configurationString = "server {\
        listen 80;\
        server_name " + cname + ";\
        access_log /var/log/nginx/" + cname + ";\
        location / {\
            proxy_pass http://127.0.0.1:" + port + "/;\
        }\
    }";

    // Then write it bro
    fs.writeFile('/etc/nginx/sites-enabled/' + cname, configurationString, function(err) {
        if(err) callbackError();
        else callback();
    });
};

module.exports.reloadNginx = function(callback) {
    var nginx = childProcess.spawn('server', ['nginx', 'reload']);
    nginx.on('exit', function() {
        callback();
    });

}
