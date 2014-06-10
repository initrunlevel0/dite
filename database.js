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
    applications: [applicationSchema]
});


var User = mongoose.model('User', userSchema)

module.exports.User = User;

var getUser = function(userName, callback, plainData) {
    if(!plainData) {
        User.findOne({userName: userName}, function(err, resultUser) {
            if(err) callback(err);
            else {
                if (resultUser == null) callback(new Error("The user doesn't exist."));
                else callback(err, resultUser);
            };
        });
    } else {
        User.findOne({userName: userName}).lean().exec(function(err, resultUser) {
            if(err) callback(err);
            else {
                if (resultUser == null) callback(new Error("The user doesn't exist."));
                else callback(err, resultUser);
            };
        });
    }
};

module.exports.getUser = getUser;
