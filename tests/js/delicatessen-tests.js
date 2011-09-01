(function() {
    //--------------------------------------------------------------------
    // Setup and cleanup
    //--------------------------------------------------------------------
    beforeEach(function() {
        runs(function() {
            chrome.extension.getBackgroundPage().DELICT_BG.reload();
        });
        waitsFor(function() {
                var bg = chrome.extension.getBackgroundPage();
                return bg.DELICT_BG && bg.DELICT_BG.ready;
            },
            "background page didn't reload", 5000);
    });

    //--------------------------------------------------------------------
    // Test cases
    //--------------------------------------------------------------------
    var get_user_name = {
        descr : "user name is null the first time",
        test : function() {
            var user;

            runs(function() {
                DELICATESSEN.get_user(function(o) { user = o });
            });

            waitsFor(
                function() { return user !== undefined },
                "get_user never returned", 1000);

            runs(function() { expect(user).toBeNull() });
        }
    };

    var set_get_user_name = {
        descr : "must allow to set the user name and get it back",
        test : function() {

            var user;

            runs(function() {
                DELICATESSEN.set_user("foo");
                DELICATESSEN.get_user(function(o) { user = o });
            });

            waitsFor(
                function() { return user !== undefined },
                "get_user never returned", 1000);

            runs(function() {
                expect(user).toBe("foo");

                DELICATESSEN.set_user("delicatessen")

                user = undefined;
                DELICATESSEN.get_user(function(o) { user = o });
            });

            waitsFor(
                function() { return user !== undefined },
                "get_user never returned", 1000);

            runs(function() { expect(user).toBe("delicatessen") });
        }
    };

    //--------------------------------------------------------------------
    // Auxiliary functions
    //--------------------------------------------------------------------
    var test_it = function(test_cases) {
        return function() {
            for (var i = 0; i < test_cases.length; i++) {
                it(test_cases[i].descr, test_cases[i].test);
            }
        }
    }

    //--------------------------------------------------------------------
    // Test suites
    //--------------------------------------------------------------------
    describe(
        "Delicatessen API tests",
        function() {
            describe(
                "User name test",
                test_it([get_user_name ,set_get_user_name]));
        });
})();
