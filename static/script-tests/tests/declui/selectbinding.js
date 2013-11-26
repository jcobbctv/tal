(function() {
    this.SelectBindingTest = AsyncTestCase("DU.SelectBindingTest");

    this.SelectBindingTest.prototype.setUp = function() {
    };

    this.SelectBindingTest.prototype.tearDown = function() {
    };

    this.SelectBindingTest.prototype.testSelectBindingHasCorrectName = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/selectbinding"], function(TextBinding) {
            assertEquals( "select", TextBinding.name );
        });
    };


    this.SelectBindingTest.prototype.testSelectBindingRecordsAddedFunctionInContext= function(queue) {
        expectAsserts(1);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/selectbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable" ],
            function( App, SelectBinding, Button, Label, Observable ) {

                var button = new Button();
                var avlSpy = sinon.spy( button, "addEventListener" );

                var binderParams = {};

                var context = {
                    widget : button
                };

                var onSelect = function(){
                };

                binderParams.context = context;
                var observable = new Observable( onSelect );
                SelectBinding.init( binderParams, observable );

                assertTrue( context.onSelect === onSelect );
            });
    };

    this.SelectBindingTest.prototype.testSelectBindingAddsEventListenerToWidget = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/selectbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable" ],
            function( App, SelectBinding, Button, Label, Observable ) {

                var button = new Button();
                var avlSpy = sinon.spy( button, "addEventListener" );

                var binderParams = {};

                var context = {
                    widget : button
                };

                var onSelect = function(){
                };

                binderParams.context = context;
                var observable = new Observable( onSelect );
                SelectBinding.init( binderParams, observable );

                assertTrue( avlSpy.calledOnce );
                assertEquals( "select", avlSpy.args[ 0 ][ 0 ] );
                assertEquals( onSelect, avlSpy.args[ 0 ][ 1 ] );
            });
    };

    this.SelectBindingTest.prototype.testSelectBindingRemoveAndReaddsEventListenerToWidget = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/selectbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable" ],
            function( App, SelectBinding, Button, Label, Observable ) {

                var button = new Button();
                var avlSpy = sinon.spy( button, "addEventListener" );
                var rvlSpy = sinon.spy( button, "removeEventListener" );

                var binderParams = {};

                var context = {
                    widget : button
                };

                var onSelect = function(){
                };
                var onSelect2 = function(){
                };

                binderParams.context = context;
                var observable = new Observable( onSelect );
                SelectBinding.init( binderParams, observable );

                observable( onSelect2 );
                SelectBinding.update( binderParams, observable );

                assertTrue( rvlSpy.calledOnce );
                assertEquals( "select", rvlSpy.args[ 0 ][ 0 ] );
                assertEquals( onSelect, rvlSpy.args[ 0 ][ 1 ] );

                assertTrue( avlSpy.calledTwice );
                assertEquals( "select", avlSpy.args[ 0 ][ 0 ] );
                assertEquals( onSelect, avlSpy.args[ 0 ][ 1 ] );
                assertEquals( "select", avlSpy.args[ 1 ][ 0 ] );
                assertEquals( onSelect2, avlSpy.args[ 1 ][ 1 ] );

            });
    };



})();
