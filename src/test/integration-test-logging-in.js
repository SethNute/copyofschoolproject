var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
 
webdriverio
    .remote(options)
    .init()
    .url('localhost:8080')
    .setValue('#login-email-input', 'email')
    .setValue('#login-password-input', 'password')
    .click('#login-button')
    .getLocationInView('#username-listing').then(function(loc) {
        if (loc !== null) {
            console.log("Passed - Succesfully logged in!");
        } else {
            console.log("Failed - Error logging in.");
        }
    })
    .end();