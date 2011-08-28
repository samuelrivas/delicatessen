describe(
    "Delicatessen API tests",
    function() {
        describe(
            "User name test",
            function() {
                it(
                    "must allow to set the user name and get it back",
                    function() {

                        var user = null;

                        runs(
                            function() {
                                chrome.extension.sendRequest(
                                    {call : "set_user", args : "foo"},
                                    function(o) { });

                                chrome.extension.sendRequest(
                                    {call : "get_user"},
                                    function(o) { user = o });
                            });

                        waitsFor(
                            function() { return user !== null },
                            "get_user never returned", 1000);

                        runs(function() {
                            expect(user).toBe("foo");

                            chrome.extension.sendRequest(
                                {call : "set_user", args : "delicatessen"},
                                function(o) { });

                            user = null;
                            chrome.extension.sendRequest(
                                {call : "get_user"},
                                function(o) { user = o; console.log(user) });
                        });

                        waitsFor(
                            function() { return user !== null },
                            "get_user never returned", 1000);

                        runs(function() {
                            console.log(user);
                            expect(user).toBe("delicatessen") });
                    });
            });
    });
