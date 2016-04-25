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
    .setValue('#register-username-input', Math.random().toString(36).substring(7))
    .setValue('#register-email-input', Math.random().toString(36).substring(7))
    .setValue('#register-password-input', Math.random().toString(36).substring(7))
    .click('#register-button')
    .getLocationInView('#username-listing').then(function(loc) {
        if (loc !== null) {
            console.log("Passed - Succesfully created account!");
        } else {
            console.log("Failed - Error creating account.");
        }
    })
    .end();

