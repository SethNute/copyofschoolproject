require('./app.js');
var mongoose = require('mongoose');
var user = require("./lib/schemas/userSchema");
user.remove({}, function() {

var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
 
console.log('Running system tests.');

var passed = true;

// Tests log out functionality
webdriverio
    .remote(options)
    .init()
    .url('http://localhost:8080')
    .getTitle().then(function(title) {
        if(title !== 'Collaborative Music Player') {
            passed = false;
        }
    })
    .setValue('#register-email-input', 'a@a.com')
    .setValue('#register-username-input', 'a')
    .setValue('#register-password-input', 'a')
    .click('#register-button')
    .click('#logout-button')
    .end(function() {
        if(passed) {
            console.log('Passed log in test');
        } else {
            console.log('Failed log in test');
        }
        process.exit();
    });

});