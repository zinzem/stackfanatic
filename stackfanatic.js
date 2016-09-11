var args = require('system').args;
var page = require('webpage').create();
var env = require('system').env;

var googleEmail = args[1] || env.GOOGLE_EMAIL;
var googlePassword = args[2] || env.GOOGLE_PASSWORD;

var landingUrl = "http://stackoverflow.com/";
var loginUrl = "https://stackoverflow.com/users/login";
var googleLoginUrl = "https://accounts.google.com";

if (!googleEmail && !googlePassword) {
    console.log("either give google email and password as parameter, either use GOOGLE_EMAIL and GOOGLE_PASSWORD env variables.");
    phantom.exit();
}

page.onConsoleMessage = function (msg) {
    console.log(msg);
};
page.onNavigationRequested = function (url, type, willNavigate, main) {
    console.log(url);

    if (url == landingUrl) {
        console.log("success");
        console.log("lets enjoy the view here a bit...");
        setTimeout(function () {
            console.log("bye bye");
            phantom.exit();
        }, 10000);
    } else if (url.indexOf(googleLoginUrl) == 0) {
        trySignIn();
    }
};
page.open(loginUrl, function(status) {
    page.evaluate(function () {
        var divs = document.getElementsByClassName("google-login");

        if (divs != null && divs.length > 0) {
            console.log("loging in with google");
            divs[0].click();
        }
    });
});

function trySignIn() {
    if (enterEmail()) {
        console.log("entered email");
        setTimeout(function () {
            enterPassword();
            console.log("entered password");
        }, 1000);
    }
}

function enterEmail() {
    return page.evaluate(function (googleEmail) {
        var emailInput = document.getElementById("Email");
        var nextButton = document.getElementById("next");

        if (emailInput && nextButton) {
            emailInput.value = googleEmail;
            nextButton.click();
            return true;
        }
        return false;
    }, googleEmail);
}

function enterPassword() {
    page.evaluate(function (googlePassword) {
        var passwordInput = document.getElementById("Passwd");
        var signInButton = document.getElementById("signIn");

        if (passwordInput && signInButton) {
            passwordInput.value = googlePassword;
            signInButton.click();
        }
    }, googlePassword);
}