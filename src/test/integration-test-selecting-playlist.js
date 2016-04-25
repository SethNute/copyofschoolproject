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
    .click('#playlist-div')
    .getUrl().then(function(url) {
        if (url === 'http://localhost:8080/playlists/pop') {
            console.log("Pass - Selected a playlist");
        } else {
            console.log("Fail - Failed to select a playlist");
        }
    })
    .end();