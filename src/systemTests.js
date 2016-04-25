require('./app.js');

var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
 
console.log('Running system tests.');


webdriverio
    .remote(options)
    .init()
    .url('http://localhost:8080')
    .getTitle().then(function(title) {
        console.log('Title was: ' + title);
    })
    .end(function() {
        process.exit();
    });