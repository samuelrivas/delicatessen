var DELICATESSEN = {
    get_document : function (url, user, passwd, on_received) {
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
	DELICATESSEN.get_document(
	    "https://api.del.icio.us/v1/tags/get", user, passwd, on_received);
    }
};

window.onload = function() {
    var test_p = document.createElement("p");

    test_p.textContent = "Delicatessen is work in progress!";
    document.body.appendChild(test_p);
};
