(function() {
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

    var get_value_and_wait = function(args, timeout) {
        runs(function() {
            DELICATESSEN[args.funct](function(o) { args.value = o });
        });

        waitsFor(
            function() { return args.value !== undefined },
            args.funct + " never returned", timeout ? timeout : 1000);
    };

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
    var user_credential_tests = [
        {
            descr : "user name is null the first time",
            test : function() {
                var args = { funct : "get_user" };
                get_value_and_wait(args);
                runs(function() { expect(args.value).toBeNull() });
            }
        }, {
            descr : "password is not set the first time",
            test : function() {
                var args = { funct : "is_password_set" };
                get_value_and_wait(args);
                runs(function() { expect(args.value).toBeFalsy() });
            }
        }, {
            descr : "we can set the passwd",
            test : function() {
                var args = { funct : "is_password_set" };

                runs(function() {
                    DELICATESSEN.set_passwd("foo");
                });

                get_value_and_wait(args);
                runs(function() { expect(args.value).toBeTruthy() });
            }
        }, {
            descr : "we can set the user name and get it back",
            test : function() {
                var args = { funct : "get_user" };

                runs(function() {
                    DELICATESSEN.set_user("foo");
                });
                get_value_and_wait(args);

                runs(function() {
                    expect(args.value).toBe("foo");

                    args.value = undefined;
                    DELICATESSEN.set_user("delicatessen")
                });

                get_value_and_wait(args);
                runs(function() { expect(args.value).toBe("delicatessen") });
            }
        }];

    var tag_tests = [
        {
            descr : "get_tags returns error if user or passwd are not set",
            test : function() {
                var args = { funct : "get_tags" };
                get_value_and_wait(args);
                runs(function() {
                    expect(args.value.error).toMatch("not set");
                });
            }
        }, {
            descr : "get_tags returns 401 error if user/passwd are not correct",
            test : function() {
                var args = { funct : "get_tags" };

                runs(function() {
                    DELICATESSEN.set_user("foo");
                    DELICATESSEN.set_passwd("bar");
                });
                get_value_and_wait(args, 5000);

                runs(function() { expect(args.value.error).toMatch("401") });
            }
        }, {
            descr : "We can get cached tags regardless of credentials",
            test : function() {
                var args = {funct : "get_tags" };
                var fake_tags = ["foo", "bar"];

                runs(function() {
                    chrome.extension.sendRequest(
                        {call : "set_tags_local",
                         args : ["foo", "bar"]});
                });
                get_value_and_wait(args);

                runs(function() { expect(args.value).toEqual(fake_tags) });
            }
        }];

    //--------------------------------------------------------------------
    // Test suites
    //--------------------------------------------------------------------
    describe(
        "Delicatessen API tests",
        function() {
            describe("User credential tests", test_it(user_credential_tests));
            describe("Tag tests", test_it(tag_tests));
        });
})();
