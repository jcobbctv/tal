(function() {
    this.EventBindingTest = AsyncTestCase("DU.EventBindingTest");

   this.EventBindingTest.prototype.testEventBindingHasCorrectName = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/eventbinding"], function(EventBinding) {
            assertEquals( "event", EventBinding.name );
        });
   };

    this.EventBindingTest.prototype.testEventBindingRecordsAddedEventsInContext= function(queue) {
        expectAsserts(2);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/eventbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable" ],
            function( App, EventBinding, Button, Label, Observable ) {

                var button = new Button();
                var avlSpy = sinon.spy( button, "addEventListener" );

                var binderParams = {};

                var context = {
                    widget : button
                };

                var onFocus = function(){
                };

                var onBlur = function(){
                };

                binderParams.context = context;
                binderParams.model = { a : 10 };

                var observable = new Observable( { focus : onFocus, blur : onBlur } );
                EventBinding.init( binderParams, observable );

                assertTrue( context.events.focus.fnWrappedCallback === onFocus );
                assertTrue( context.events.blur.fnWrappedCallback === onBlur );
            });
    };

    this.EventBindingTest.prototype.testEventBindingAddsEventListenerToWidget = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/eventbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable" ],
            function( App, EventBinding, Button, Label, Observable ) {

                var button = new Button();
                var avlSpy = sinon.spy( button, "addEventListener" );

                var binderParams = {};

                var context = {
                    widget : button
                };

                var onSelect = function(){
                };

                var onBlur = function(){
                };

                binderParams.context = context;
                var observable = new Observable( { focus : onSelect, blur : onBlur } );
                EventBinding.init( binderParams, observable );

                assertTrue( avlSpy.calledTwice );
                assertEquals( "focus", avlSpy.args[ 0 ][ 0 ] );
                assertEquals( onSelect, avlSpy.args[ 0 ][ 1 ].fnWrappedCallback );

                assertEquals( "focus", avlSpy.args[ 0 ][ 0 ] );
                assertEquals( onSelect, avlSpy.args[ 0 ][ 1 ].fnWrappedCallback );
            });
    };

    this.EventBindingTest.prototype.testEventBindingRemoveAndReaddsEventListenerToWidget = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/eventbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable" ],
            function( App, EventBinding, Button, Label, Observable ) {

                var button = new Button();
                var avlSpy = sinon.spy( button, "addEventListener" );
                var rvlSpy = sinon.spy( button, "removeEventListener" );

                var binderParams = {};

                var context = {
                    widget : button
                };

                var onFocus1 = function(){};
                var onBlur1 = function(){};
                var onFocus2 = function(){};
                var onBlur2 = function(){};

                var event1 = { focus : onFocus1, blur : onBlur1 };
                var event2 = { focus : onFocus2, blur : onBlur2 };

                binderParams.context = context;
                var observable = new Observable( event1 );
                EventBinding.init( binderParams, observable );

                observable( event2 );
                EventBinding.update( binderParams, observable );

                assertTrue( rvlSpy.calledTwice );
                assertEquals( "focus", rvlSpy.args[ 0 ][ 0 ] );
                assertEquals( onFocus1, rvlSpy.args[ 0 ][ 1 ].fnWrappedCallback );
                assertEquals( "blur", rvlSpy.args[ 1 ][ 0 ] );
                assertEquals( onBlur1, rvlSpy.args[ 1 ][ 1 ].fnWrappedCallback );

                assertEquals( 4, avlSpy.callCount );
                assertEquals( "focus", avlSpy.args[ 2 ][ 0 ] );
                assertEquals( onFocus2, avlSpy.args[ 2 ][ 1 ].fnWrappedCallback );
                assertEquals( "blur", avlSpy.args[ 3 ][ 0 ] );
                assertEquals( onBlur2, avlSpy.args[ 3 ][ 1 ].fnWrappedCallback );
            });
    };



})();
