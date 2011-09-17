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

    var is_passwd_set = {
        descr : "password is not set the first time",
        test : function() {
            var set;

            runs(function() {
                DELICATESSEN.is_password_set(function(o) { set = o });
            });

            waitsFor(
                function() { return set !== undefined },
                "password_set never returned", 1000);

            runs(function() { expect(set).toBeFalsy() });
        }
    };

    var set_passwd = {
        descr : "we can set the passwd",
        test : function() {
            var set;

            runs(function() {
                DELICATESSEN.set_passwd("foo");
                DELICATESSEN.is_password_set(function(o) { set = o });
            });

            waitsFor(
                function() { return set !== undefined },
                "password_set never returned", 1000);

            runs(function() { expect(set).toBeTruthy() });
        }
    };

    var set_get_user_name = {
        descr : "we can set the user name and get it back",
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

    var tag_tests = [
        {
            descr : "get_tags returns error if user or passwd are not set",
            test : function() {
                var tags;

                runs(function() {
                    DELICATESSEN.get_tags(function(o) { tags = o });
                });

                waitsFor(
                    function() { return tags !== undefined },
                    "get_tags never returned", 1000);

                runs(function() { expect(tags.error).toMatch("not set") });
            }
        },
        {
            descr : "get_tags returns 401 error if user/passwd are not correct",
            test : function() {
                var tags;

                runs(function() {
                    DELICATESSEN.set_user("foo");
                    DELICATESSEN.set_passwd("bar");
                    DELICATESSEN.get_tags(function(o) { tags = o });
                });

                waitsFor(
                    function() { return tags !== undefined },
                    "get_tags never returned", 5000);

                runs(function() { expect(tags.error).toMatch("401") });
            }
        },
        {
            descr : "We can get cached tags regardless of credentials",
            test : function() {
                var tags;
                var fake_tags = ["foo", "bar"];

                runs(function() {
                    chrome.extension.sendRequest(
                        {call : "set_tags_local",
                         args : ["foo", "bar"]});
                    DELICATESSEN.get_tags(function(o) { tags = o });
                });

                waitsFor(
                    function() { return tags !== undefined },
                    "get_tags never returned", 1000);

                runs(function() { expect(tags).toEqual(fake_tags) });
            }
        }];

    //--------------------------------------------------------------------
    // Auxiliary functions
    //--------------------------------------------------------------------
    var test_it = function(test_cases) {
        return function() {
            for (var i = 0; i < test_cases.length; i++) {
                it(test_cases[i].descr, test_cases[i].test);
            }
        }
    };

    //--------------------------------------------------------------------
    // Test suites
    //--------------------------------------------------------------------
    describe(
        "Delicatessen API tests",
        function() {
            describe(
                "User name tests",
                test_it(
                    [get_user_name, is_passwd_set, set_passwd,
                     set_get_user_name]));

            describe(
                "Tag tests",
                test_it(tag_tests));
        });
})();
