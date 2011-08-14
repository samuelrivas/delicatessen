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
    DELICATESSEN.get_tags(
        function(t) {
            console.log("Got " + t.length + " tags");
            DELICATESSEN.render_tags(t, document.body);
        });
};
