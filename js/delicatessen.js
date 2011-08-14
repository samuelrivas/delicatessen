var DELICATESSEN = {
    get_tags : function(on_received) {
        chrome.extension.sendRequest({async_call : "get_tags"}, on_received);
    }
};

window.onload = function() {
    var test_p = document.createElement("p");

    test_p.textContent = "Delicatessen is work in progress!";
    document.body.appendChild(test_p);
};
