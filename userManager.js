/**
 * dité: Process based shared web hosting
 *
 * userManager.js
 * The user authentication and registration manager for those who use this application.
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var database = require('./database');
var helper = require('./helper');


var newUser = function(userName, password, callback, callbackError) {
    helper.getHashedPassword(password, function(hashedPassword) {
        // Check if user is exist
        database.getUser(userName, function(resultUser) {
            callbackError('The username is not available.')
        }, function(errMessage) {
            var newUser = new database.User({userName: userName, password: hashedPassword});
            newUser.save(function(err) {
                if(err) callbackError('Something wrong with your MongoDB.');
                else callback();
            });
        });
    });
};

module.exports.newUser = newUser;

var authUser = function(userName, password, callback, callbackError) {
    helper.getHashedPassword(password, function(hashedPassword) {
        database.getUser(userName, function(resultUser) {
            if(resultUser.password == hashedPassword) callback();
            else {
                callbackError('Your username or password is not correct.')
            }
        }, function(errMessage) {
            callbackError(errMessage);
        });
    });
};

module.exports.authUser = authUser;


var getAllUsers = function(callback, callbackError) {
    database.User.find({}, function(err, result) {
        if(err) callbackError('Something wrong with your MongoDB.');
        callback(result);
    });
};

module.exports.getAllUsers = getAllUsers;
