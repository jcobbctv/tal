(function() {
    this.TypeBindingTest = AsyncTestCase("DU.TextBindingTest");

    this.TypeBindingTest.prototype.setUp = function() {
    };

    this.TypeBindingTest.prototype.tearDown = function() {
    };

    this.TypeBindingTest.prototype.testTextBindingHasCorrectName = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/textbinding"], function(TextBinding) {
            assertEquals( "text", TextBinding.name );
        });
    };

    this.TypeBindingTest.prototype.testTextBindingHasNoInitFunction = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/textbinding"], function(TextBinding) {
            assertTrue( TextBinding.init === undefined );
        });
    };

    this.TypeBindingTest.prototype.testTextBindingUpdateCallSetTextOnWidgetWithSetText= function(queue) {
        expectAsserts(1);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/textbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable" ],
            function( App, TextBinding, Button, Label, Observable ) {

                var label = {
                    text : "",
                    setText : function( text ){ this.text = text; },
                    getText : function(){ return this.text; }
                };

                var binderParams = {};

                var context = {
                    widget : label
                };

                binderParams.context = context;
                var observable = new Observable( "SetFromObservable" );
                binderParams.modelAccessor = function(){ return { text : 1 }; };

                TextBinding.update( binderParams, observable );

                assertEquals( "SetFromObservable", label.getText() );
            });
    };

    this.TypeBindingTest.prototype.testTextBindingUpdateCallSetTextOnButtonWithLabel = function(queue) {
        expectAsserts(1);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/textbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable" ],
            function( App, TextBinding, Button, Label, Observable ) {

            var button = new Button();
            var label = new Label( "This Is A Label" );

            button.appendChildWidget( label );

            var binderParams = {};

            var context = {
                widget : button
            };

            binderParams.context = context;
            var observable = new Observable( "SetFromObservable" );
            binderParams.modelAccessor = function(){ return { text : 1 } };

            TextBinding.update( binderParams, observable );

            assertEquals( "SetFromObservable", label.getText() );
        });
    };

    this.TypeBindingTest.prototype.testTextBindingAddLabelToWidgetWithoutSetText = function(queue) {
        expectAsserts(1);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/textbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable", "antie/declui/widgetfactory" ],
            function( App, TextBinding, Button, Label, Observable, WidgetFactory ) {

                var button = new Button();

                var binderParams = {};

                var context = {
                    widget : button
                };

                binderParams.context = context;
                var observable = new Observable( "SetFromObservable" );
                binderParams.modelAccessor = function(){ return { text : 1 } };
                binderParams.widgetFactory = WidgetFactory;

                TextBinding.update( binderParams, observable );

                var label = button.getChildWidgets()[ 0 ];

                assertEquals( "SetFromObservable", label.getText() );
            });
    };

})();
