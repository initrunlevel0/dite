/**
 * dité: Process based shared web hosting
 *
 * helper.js
 * Some helper function frequently used by system
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 */

var crypto = require('crypto');

module.exports.getHashedPassword = function(unhashedPassword, callback) {
    callback(crypto.createHash('md5').update(unhashedPassword).digest('hex'));
};
