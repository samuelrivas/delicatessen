var DELICT_BG = function() {
    // Private variables
    // -----------------
    var user = null;
    var passwd = null;
    var tags = null;

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
    that.is_passwd_set = function() { return passwd !== null };
    that.set_tags_local = function(t) { tags = t };

    that.get_tags = function(callback) {
        if (tags) {
            callback(tags);
        } else if (user === null) {
            callback({error : "user is not set"});
        } else if (passwd === null) {
            callback({error : "passwd is not set"});
        } else {
            DELICT_BG.get_tags_internal(
                user, passwd,
                function(o) {
                    if (! o.error) {
                        tags = o;
                    }
                    callback(o);
                });
        }
    };

    return that;
}();

// Unprivileged functions
DELICT_BG.reload = function() {
    DELICT_BG.ready = false;
    location.reload();
};

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

    } else if (DELICT_BG.request_handler[request.async_call]) {
        console.log(
            "Background received asynchronous request:" + request.async_call);
        DELICT_BG.request_handler[request.async_call](
            request.args, send_response);

    } else {
        console.log("Background received unsupported request: " + request);
        send_response("unsupported");
    }
}

DELICT_BG.get_document = function(url, user, passwd, on_received) {
    var rpc_request;

    rpc_request = new XMLHttpRequest();
    rpc_request.open("GET", url, true, user, passwd);

    rpc_request.onreadystatechange = function() {
        console.log("New request state: " + rpc_request.readyState);
        if (rpc_request.readyState === 4) {
            console.log(
                "Received HTTP response with status: " + rpc_request.status
                    + " " + rpc_request.statusText);
            if (rpc_request.status === 200) {
                on_received(rpc_request.responseXML);
            } else {
                on_received(
                    {error: "Wrong HTTP status: " + rpc_request.status + " "
                     + rpc_request.statusText});
            }
        }
    }

    console.log("sending HTTP request");
    rpc_request.send();
};

DELICT_BG.get_tags_internal = function(user, passwd, on_received) {
    var callback = function(o) {
        if (o.error) {
            on_received(o);
        } else {
            console.log("Parsing XML tags document");
            on_received(DELICT_BG.parse_tags(tags_doc));
        }
    }
    this.get_document(
        "https://api.del.icio.us/v1/tags/get", user, passwd, callback);
},

// Internal stuff
//===============

// Group functions exported to the outside through
// chrome.extension.sendRequest in the request_handler inner object to ease
// our handle_request function
DELICT_BG.request_handler = {
    set_user : DELICT_BG.set_user,
    get_user : DELICT_BG.get_user,
    set_passwd : DELICT_BG.set_passwd,
    is_passwd_set : DELICT_BG.is_passwd_set,
    get_tags : function(args, on_result) { DELICT_BG.get_tags(on_result) },
    set_tags_local : DELICT_BG.set_tags_local,
    reload : DELICT_BG.reload
}

// XXX This function could be heavy, but my tests with near to 2000 tags
// show that is not worth asynchronising it
DELICT_BG.parse_tags = function(tags_doc) {
    var nodes = tags_doc.getElementsByTagName("tag");
    var tags = [];
    var i;

    for (i = 0; i < nodes.length; i++) {
        tags.push(nodes[i].attributes["tag"].nodeValue);
    }
    return tags;
};

// Add the request listener
chrome.extension.onRequest.addListener(DELICT_BG.handle_request);

// We need to notify when we are up for tests to work just after resetting the
// background with reload()
DELICT_BG.ready = true;
