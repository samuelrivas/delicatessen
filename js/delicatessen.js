var DELICATESSEN = {
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
    }
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
