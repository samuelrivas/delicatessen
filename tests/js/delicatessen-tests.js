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
                                DELICATESSEN.set_user("foo");

                                DELICATESSEN.get_user(function(o) { user = o });
                            });

                        waitsFor(
                            function() { return user !== null },
                            "get_user never returned", 1000);

                        runs(
                            function() {
                                expect(user).toBe("foo");

                                DELICATESSEN.set_user("delicatessen")

                                user = null;
                                DELICATESSEN.get_user(function(o) { user = o });
                            });

                        waitsFor(
                            function() { return user !== null },
                            "get_user never returned", 1000);

                        runs(function() { expect(user).toBe("delicatessen") });
                    });
            });
    });
