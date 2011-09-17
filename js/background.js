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

    that.get_tags = function(callback) {
        if (tags) {
            callback(tags);
        } else {
            DELICT_BG.get_tags_internal(
                that.get_user(), get_passwd(),
                function(t) {
                    tags = t;
                    callback (t);
                });
        }
    };

    // Group functions exported to the outside through
    // chrome.extension.sendRequest in the request_handler inner object to ease
    // our handle_request function
    that.request_handler = {
        set_user : that.set_user,
        get_user : that.get_user,
        set_passwd : that.set_passwd,
        get_tags : function(args, on_result) { that.get_tags(on_result) }
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
            if (rpc_request.status !== 200) {
                throw "Wrong HTTP status: " + rpc_request.status + " "
                    + rpc_request.statusText
            }
            console.log("Received HTTP response");
            on_received(rpc_request.responseXML);
        }
    }

    console.log("sending HTTP request");
    rpc_request.send();
};

DELICT_BG.get_tags_internal = function(user, passwd, on_received) {
    var callback = function(tags_doc) {
        console.log("Parsing XML tags document");
        on_received(DELICT_BG.parse_tags(tags_doc));
    }
    this.get_document(
        "https://api.del.icio.us/v1/tags/get", user, passwd, callback);
},

// Internal stuff
//===============

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
