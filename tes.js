/**
 * dité: Process based shared web hosting
 *
 * gitConfigurator.js
 * GIT Repository Configurator
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var tes = {};

tes['git'] = function() {
    var gitConfigurator = require('./gitConfigurator');
    gitConfigurator.configureApp('/home/wira.nasigoreng', 'ssss', 1001, 1001, function() {
        console.log('Done');
    }, function(errMessage) {
        console.log(errMessage);
    })
}

tes['node.configure'] = function() {
    var nodeAppConfigurator = require('./nodeAppConfigurator');
    nodeAppConfigurator.configureApp('/home/wira.nasigoreng', 1001, 1001, function() {
        console.log('Done');
    }, function(errMessage) {
        console.log(errMessage);
    })
}

var tesUserName = "wira";
var tesUserPassword = "wira";
tes['user.create'] = function() {
    var userManager = require('./userManager');
    userManager.newUser(tesUsername, tesUserPassword, function(newUser) {
        console.log(newUser);
    }, function(err) {
        console.log(err);
    })
}

tes['user.get'] = function() {
    var database = require('./database');
    database.getUser(tesUserName, function(user) {
        console.log(user);
    })
}

var tesAppName = "pertamax";
var tesAppSSHKey = "just testing";
var tesAppCname = "pertamax.wirama.web.id"

tes['node.appCreate'] = function() {
    var appManager = require('./appManager');
    appManager.newApplication(tesUserName, tesAppName, 'node', tesAppSSHKey, tesAppCname, function(userData) {
        console.log('Check check, are you sure this is success?');
        console.log(userData);
    }, function(errMessage) {
        console.log(errMessage);
    });
}
// Run tes from selected
tes[process.argv[2]]();

