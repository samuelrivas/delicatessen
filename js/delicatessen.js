var DELICATESSEN = {
    bg_call : function(method, args, on_result) {
        if (on_result) {
            chrome.extension.sendRequest(
                {call : method, args : args }, on_result);
        } else {
            chrome.extension.sendRequest({call : method, args : args });
        }
    },
    set_user : function(user) { this.bg_call("set_user", user) },
    get_user : function(on_result) {
        this.bg_call("get_user", undefined, on_result);
    },
    get_tags : function(on_received) {
        chrome.extension.sendRequest({async_call : "get_tags"}, on_received);
    },
    render_tags : function(tags, parentNode) {
        for (var i = 0; i < tags.length; i++) {
            var div = document.createElement("div");
            div.textContent = tags[i];
            div.className = "tag";
            parentNode.appendChild(div);
        }
    },
    open_tests : function() { chrome.tabs.create({url : "tests/tests.html"}) }
};

window.onload = function() {

    var loading = document.createElement("div");
    loading.textContent = "Loading ...";
    loading.id = "loading";
    document.body.appendChild(loading);

    DELICATESSEN.get_tags(
        function(t) {
            console.log("Got " + t.length + " tags");
            document.body.removeChild(loading);
            DELICATESSEN.render_tags(t, document.body);
        });
};
