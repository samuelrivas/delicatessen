window.onload = function() {
    var testString = document.createElement("p");
    var user;
    var passwd;

    testString.textContent = "Delicatessen is work in progress!";
    document.body.appendChild(testString);

    user = window.prompt("Write your user name", "User Name");
    passwd = window.prompt("Write your password", "Password");

    http = new XMLHttpRequest();
    http.open("GET", "https://api.del.icio.us/v1/tags/get", true, user, passwd);
    http.onreadystatechange =
	function() {
	    var xmlText = document.createElement("p");
	    console.log("Received http response");
	    xmlText.textContent = http.response;
	    document.body.appendChild(xmlText);
	};
    console.log("sending http request");
    http.send();
}
