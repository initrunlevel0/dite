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


var newUser = function(userName, password, callback) {
    helper.getHashedPassword(password, function(hashedPassword) {
        // Check if user is exist
        database.getUser(userName, function(err) {
            if(err) {
                var newUser = new database.User({userName: userName, password: hashedPassword});
                newUser.save(function(err) {
                    callback(err, newUser);
                });
            } else {
                callback(new Error('The user is not available'));
            }
        });
    });
};

module.exports.newUser = newUser;

var authUser = function(userName, password, callback) {
    helper.getHashedPassword(password, function(hashedPassword) {
        database.getUser(userName, function(err, resultUser) {
            if(resultUser.password == hashedPassword) callback(null, true);
            else {
                callback(new Error('Your username or password is not correct.'), false);
            }
        });
    });
};

module.exports.authUser = authUser;


var getAllUsers = function(callback) {
    database.User.find({}).lean().exec(function(err, result) {
        callback(err, result);
    });
};

module.exports.getAllUsers = getAllUsers;
