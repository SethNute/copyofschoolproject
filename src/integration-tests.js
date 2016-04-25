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
console.log('Running integration tests now.');

// Tests log out functionality
webdriverio
    .remote(options)
    .init()
    .url('http://localhost:8080')
    .setValue('#register-email-input', 'a@a.com')
    .setValue('#register-username-input', 'a')
    .setValue('#register-password-input', 'a')
    .click('#register-button')
    .isExisting('#coinsText')
    .then(function(coinsShown) {
        if(!coinsShown) {
            console.log('Pass - register test');
        } else {
            console.log('Fail - register test');
        }
    })
    .click('#logout-button')
    .isExisting('#coinsText')
    .then(function(exists) {
        if(!exists) {
            console.log('Pass - log out test');
        } else {
            console.log('Fail - log out test');
        }
    })
    .setValue('#login-email-input', 'a@a.com')
    .setValue('#login-password-input', 'a')
    .click('#login-button')
    .getLocationInView('#username-listing').then(function(loc) {
        if (loc !== null) {
            console.log("Pass - log in test");
        } else {
            console.log("Fail - log in test");
        }
    })
    .click('#playlist-div')
    .getUrl().then(function(url) {
        if (url === 'http://localhost:8080/playlists/pop') {
            console.log("Pass - select playlist test");
        } else {
            console.log("Fail - select playlist test");
        }
    })
    .end()
    .then(function() {
        process.kill(process.pid);
    });
});