var DELICT_BG = function() {
    // Private variables
    // -----------------
    var user = null;
    var passwd = null;

    var that = {};

    // Internal functions
    var get_passwd = function() {
        passwd = that.prompt_if_null(passwd, "Password");
        return passwd;
    };

    // Privileged functions
    // --------------------
    that.get_user = function() {
        user = that.prompt_if_null(user, "User Name");
        return user;
    };
    that.set_user = function(new_user) { user = new_user };
    that.set_passwd = function(new_passwd) { passwd = new_passwd };

    // Group functions exported to the outside through
    // chrome.extension.sendRequest in the request_handler inner object to ease
    // our handle_request function
    that.request_handler = {
        set_user : that.set_user,
        get_user : that.get_user,
        set_passwd : that.set_passwd,
    }
    return that;
}();

// Unprivileged functions
DELICT_BG.prompt_if_null = function(data, prompt_text) {
    if (data === null) {
        data = window.prompt(prompt_text);
    }
    return data;
}

DELICT_BG.handle_request = function(request, sender, send_response) {
    if (DELICT_BG.request_handler[request.call]) {
        console.log("Background received request:" + request.call);
        send_response(DELICT_BG.request_handler[request.call](request.args));
    } else {
        console.log("Background received unsupported request: " + request);
        send_response("unsupported");
    }
}

// Add the request listener
chrome.extension.onRequest.addListener(DELICT_BG.handle_request);
