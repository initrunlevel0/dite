/**
 * dité: Process based shared web hosting
 *
 * appManager.js
 * Application Instance management.
 * Track in MongoDB, create in filesystem
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var database = require('./database');
var helper = require('./helper');
var config = require('./config');
var pamManager = require('./pamManager');

var setupEnvironment = function(homeDir, sshPublicKey, uid, gid, applicationType, callback) {
    // First let's configure our GIT setup
    var gitConfigurator = require('./gitConfigurator');
    gitConfigurator.configureApp(homeDir, sshPublicKey, uid, gid, function(err) {
        if(err) callback(err);
        else {
            switch(applicationType) {
                // Per applicationType configurator
                case 'node':
                    var nodeAppConfigurator = require('./nodeAppConfigurator');
                    nodeAppConfigurator.configureApp(homeDir, uid, gid, function(err) {
                        callback(err);
                    });
                    break;
            }
        }
    });

};

var editApplication = function(userName, applicationName, sshPublicKey, dnsCname, callback) {
    var gitConfigurator = require('./gitConfigurator');
    database.getUser(userName, function(err, userData) {
        // Find the application designated application
        userData.applications.forEach(function(app) {
            if(app.systemUserName == userName + "." + applicationName) {
                // Change sshPublicKey
                gitConfigurator.writeSshPublicKey(homeDir, sshPublicKey, app.systemUID, app.systemGID, function() {
                    app.sshPublicKey = sshPublicKey;
                    app.dnsCname = dnsCname;
                    userData.save(function(err) {
                        callback(err);
                    });
                });
            }
        });
    });
};


module.exports.editApplication = editApplication;
var newApplication = function(userName, applicationName, applicationType, sshPublicKey, dnsCname, callback) {
    database.getUser(userName, function(err, userData) {
        if(err) callback(err);
        else {
            pamManager.createUserAndGroup(userName + "." + applicationName, function(err, uid, gid, homeDirectory) {
                if(err) callback(err);
                else {
                    setupEnvironment(homeDirectory, sshPublicKey, uid, gid, applicationType, function(err) {
                        if(err) callback(err);
                        else {
                            var applicationData = {
                                applicationType: applicationType,
                                systemUserName: userName + "." + applicationName,
                                systemHomeDir: homeDirectory,
                                systemUID: uid,
                                systemGID: gid,
                                sshPublicKey: sshPublicKey,
                                dnsCname: dnsCname
                            };

                            userData.applications.push(applicationData);
                            userData.save(function(err) {
                                if(err) callback(err);
                                else callback(null, applicationData);
                            });
                        }
                    });
                }
            });
        }
    });
};

module.exports.newApplication = newApplication;



