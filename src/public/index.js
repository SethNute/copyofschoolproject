$(document).ready(function () {
    //clear forms
    $(':input').val('');

    addButtonListeners();

    if (isUserLoggedIn()) {
        getUserInfo(localStorage.getItem("sessionToken"));
    }
});

function addButtonListeners() {
    $("#login-button").click(function(e) {
        logUserIn($("#login-email-input").val(), $("#login-password-input").val());
    }); 

    $("#register-button").click(function(e) {
        createNewUser($("#register-email-input").val(), $("#register-username-input").val(), $("#register-password-input").val());
    }); 

    $('#logout-button').click(function(e) {
        logUserOut();
    });
}

function logUserIn(email, password) {
    var request = $.ajax({
        type: "POST",
        url: "/users/login",
        data: {"email": email, "password": password},
        success: function (response) {
            localStorage.setItem("sessionToken", response.token);
            getUserInfo(localStorage.getItem("sessionToken"));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            styleForIncorrectUsernameOrPassword();
        }
    });
}

function createNewUser(email, username, password) {
    var request = $.ajax({
        type: "POST",
        url: "/users",
        data: {"email": email, "username": username, "password": password},
        success: function (response) {
            logUserIn(email, password);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            styleForUserAlreadyExists();
        }
    });
}

function getUserInfo(token) {
    var request = $.ajax({
        type: "POST",
        url: "/user",
        data: {"token": token},
        success: function (response) {
            localStorage.setItem("username", response.username);
            localStorage.setItem("email", response.email);
            localStorage.setItem("coins", response.coins);
            styleForLoggedInUser();
        }
    });
}

function getLeaderboards() {
    var request = $.ajax({
        type: "GET",
        url: "/leaderboard",
        success: function (response) {
            console.log(response);
            styleLeaderboardFor(response);
        }
    });
}

function logUserOut() {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("coins");

    location.reload();
}

function isUserLoggedIn() {
    return localStorage.getItem("sessionToken") !== null;
}

function styleForLoggedInUser() {
    $('#user-info').append($(
        '<h5>User Information</h5>' +
        '<div class="row">' +
            '<p><b class="col s2">Username : </b><div class="col s10">' + localStorage.getItem("username") + 
            '</div></p><p><b class="col s2">Email : </b><div class="col s10">' + localStorage.getItem("email") + '</div>' + 
            '</p><p><b class="col s2">Coins : </b><div class="col s10">' + localStorage.getItem("coins") + '</div></p>' +
        '</div>'));

    $('#login-or-register-container').hide();
    $('#logout-button').show();

    getLeaderboards();
}

function styleLeaderboardFor(users) {
    $('#user-info').append(
        $('<div class="row col s12 divider"></div>' +
          '<h4 style="text-align:center"><u>Leaderboards</u></h4>' +
          '<table class="bordered highlight centered" id="leaderboards-table"><thead><tr><th>Rank</th><th>Username</th><th>Coins</th></tr></thead></table>')
    );

    var rank = 1;
    users.forEach(function(user) {
        if (user.username && user.coins) {
            addLeaderboardRow(rank, user.username, user.coins);
            rank++;
        }
    }); 
}

function addLeaderboardRow(rank, username, coins) {
    $('#leaderboards-table').append(
        $('<tr><td>' + rank + '</td><td>' + username + '</td><td>' + coins + '</tr>')
    );
}

function styleForIncorrectUsernameOrPassword() {
    $('#login-container').children('input').each(function () {
        $(this).addClass('error-shadow');
    });
}

function styleForUserAlreadyExists() {
    $('#register-container').children('input').each(function () {
        $(this).addClass('error-shadow');
    });
}