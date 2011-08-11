var DELICATESSEN = {
    get_document : function(url, user, passwd, on_received) {
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
    },

    get_tags : function(user, passwd, on_received) {
        var callback = function(tags_doc) {
            console.log("Parsing XML tags document");
            on_received(DELICATESSEN.parse_tags(tags_doc));
        }
        DELICATESSEN.get_document(
            "https://api.del.icio.us/v1/tags/get", user, passwd, callback);
    },

    // Internal stuff
    //===============

    // XXX This function could be heavy, but my tests with near to 2000 tags
    // show that is not worth asynchronising it
    parse_tags : function(tags_doc) {
        var nodes = tags_doc.getElementsByTagName("tag");
        var tags = [];
        var i;

        for (i = 0; i < nodes.length; i++) {
            tags.push(nodes[i].attributes["tag"]);
        }
        return tags;
    }
};

window.onload = function() {
    var test_p = document.createElement("p");

    test_p.textContent = "Delicatessen is work in progress!";
    document.body.appendChild(test_p);
};
