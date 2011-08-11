chrome.extension.onRequest.addListener(
    function (request, sender, send_response) {
        console.log("Background received request:" + request);
        send_response("unsupported")
    }
);

