/**
 * dité: Process based shared web hosting
 *
 * database.js
 * Database schema and connection management
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var mongoose = require('mongoose');
var config = require('./config');


mongoose.connect(config.database.connection)

var applicationSchema = new mongoose.Schema({
    applicationType: String,
    systemUserName: String,
    systemUID: String,
    systemGID: String,
    systemHomeDir: String,
    sshPublicKey: String,
    dnsCname: String
});

var userSchema = new mongoose.Schema ({
    userName: String,
    password: String,
    application: [applicationSchema]
});


var User = mongoose.model('User', userSchema)

module.exports.User = User;

var getUser = function(userName, callback, callbackError) {
    User.findOne({userName: userName}, function(err, resultUser) {
        if(err) callbackError("Something wrong with your MongoDB.");
        else {
            if (resultUser == null) callbackError("The user doesn't exist.");
            else callback(resultUser);
        };
    });
};

module.exports.getUser = getUser;
