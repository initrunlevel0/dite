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

var setupEnvironment = function(homeDir, sshPublicKey, uid, gid, applicationType, callback, callbackError) {
    // First let's configure our GIT setup
    var gitConfigurator = require('./gitConfigurator');
    gitConfigurator.configureApp(homeDir, sshPublicKey, uid, gid, function() {
        switch(applicationType) {
            // Per applicationType configurator
            case 'node':
                var nodeAppConfigurator = require('./nodeAppConfigurator');
                nodeAppConfigurator.configureApp(homeDir, uid, gid, function() {
                    callback();
                }, function(errMessage) {
                    callbackError(errMessage)
                });
                break;
        }
    }, function(errMessage) {
       callbackError(errMessage);
    })

};

var newApplication = function(userName, applicationName, applicationType, sshPublicKey, dnsCname, callback, callbackError) {
    database.getUser(userName, function(userData) {
        pamManager.createUserAndGroup(userName + "." + applicationName, dnsCname, function(uid, gid, homeDirectory) {
            setupEnvironment(homeDirectory, sshPublicKey, uid, gid, applicationType, function() {
                var applicationData = {
                    applicationType: applicationType,
                    systemUserName: userName + "." + applicationName,
                    systemHomeDir: homeDirectory,
                    systemUID: uid,
                    systemGID: gid,
                    sshPublicKey: sshPublicKey,
                    dnsCname: dnsCname
                };

                userData.application.push(applicationData);
                userData.save(function(err) {
                    if(err) callbackError('Something wrong with your MongoDB.');
                    else callback();
                })
            }, function(errMessage) {
                callbackError(errMessage);
            });
        }, function(errMessage) {
            callbackError(errMessage);
        });
    }, function(errMessage) {
        callbackError(errMessage);
    });
};




