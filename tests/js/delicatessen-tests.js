(function() {
    //--------------------------------------------------------------------
    // Test cases
    //--------------------------------------------------------------------
    var set_get_user_name = {
        descr : "must allow to set the user name and get it back",
        test : function() {

            var user = null;

            runs(function() {
                DELICATESSEN.set_user("foo");
                DELICATESSEN.get_user(function(o) { user = o });
            });

            waitsFor(
                function() { return user !== null },
                "get_user never returned", 1000);

            runs(function() {
                expect(user).toBe("foo");

                DELICATESSEN.set_user("delicatessen")

                user = null;
                DELICATESSEN.get_user(function(o) { user = o });
            });

            waitsFor(
                function() { return user !== null },
                "get_user never returned", 1000);

            runs(function() { expect(user).toBe("delicatessen") });
        }
    };

    //--------------------------------------------------------------------
    // Auxiliary functions
    //--------------------------------------------------------------------
    var test_it = function(test_case) {
        return function() { it(test_case.descr, test_case.test) };
    }

    //--------------------------------------------------------------------
    // Test suites
    //--------------------------------------------------------------------
    describe(
        "Delicatessen API tests",
        function() {
            describe("User name test", test_it(set_get_user_name));
        });
})();
