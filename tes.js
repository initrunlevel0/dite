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

// Run tes from selected
tes[process.argv[2]]();

