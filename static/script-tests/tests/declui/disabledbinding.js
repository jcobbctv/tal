(function() {
    this.DisabledBindingTest = AsyncTestCase("DU.DisabledBindingTest");

    this.DisabledBindingTest.prototype.setUp = function() {
    };

    this.DisabledBindingTest.prototype.tearDown = function() {
    };

    this.DisabledBindingTest.prototype.testDisabledBindingHasCorrectName = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/disabledbinding"], function(DisabledBinding) {
            assertEquals( "disabled", DisabledBinding.name );
        });
    };

    this.DisabledBindingTest.prototype.testDisabledBindingHasNoInitFunction = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/disabledbinding"], function(DisabledBinding) {
            assertTrue( DisabledBinding.init === undefined );
        });
    };

    this.DisabledBindingTest.prototype.testDisabledBindingUpdateCallSetDisabledOnWidgetWithSetDisabled= function(queue) {
        expectAsserts(2);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/disabledbinding", "antie/declui/observable" ],
            function( App, DisabledBinding, Observable ) {

                var button = {
                    text : "",
                    setDisabled : function( disable ){ this._disabled = disable; }
                };

                var binderParams = {};

                var context = {
                    widget : button
                };

                binderParams.context = context;
                var observable = new Observable( false );

                DisabledBinding.update( binderParams, observable );
                assertEquals( false, button._disabled );

                observable( true );
                DisabledBinding.update( binderParams, observable );

                assertEquals( true, button._disabled );
            });
    };
})();
