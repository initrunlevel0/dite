/**
 * dité: Process based shared web hosting
 *
 * gitConfigurator.js
 * GIT Repository Configurator
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var tes = {};

var tesUserName = "wira";
var tesUserPassword = "wira";
tes['user.create'] = function() {
    var userManager = require('./userManager');
    userManager.newUser(tesUserName, tesUserPassword, function(err, newUser) {
        console.log(err, newUser);
    });
}

tes['user.get'] = function() {
    var database = require('./database');
    database.getUser(tesUserName, function(err, user) {
        console.log(err, user);
    })
}

var tesAppName = "pertamax";
var tesAppSSHKey = "just testing";
var tesAppCname = "pertamax.wirama.web.id"

tes['node.appCreate'] = function() {
    var appManager = require('./appManager');
    appManager.newApplication(tesUserName, tesAppName, 'node', tesAppSSHKey, tesAppCname, function(err, userData) {
        console.log(err, userData);
    });
}

tes['tes.list'] = function() {
    for (i in tes) {
        console.log(i);
    }
}
// Run tes from selected
tes[process.argv[2]]();

