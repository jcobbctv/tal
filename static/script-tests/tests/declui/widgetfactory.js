(function() {
    this.WidgetFactoryTest = AsyncTestCase("DU.WidgetFactory");

    this.WidgetFactoryTest.prototype.setUp = function() {
    };

    this.WidgetFactoryTest.prototype.tearDown = function() {
    };


    this.WidgetFactoryTest.prototype.testCreateWidgetAppendsToParentIfChild = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/button", "antie/widgets/label", "antie/declui/widgetfactory"],
            function( application,Button,Label,WidgetFactory) {

                var buttonContext       = { widget : new Button(), children : [] };
                var subButtonContext    = { nodeType : "button", parentContext : buttonContext };

                var widget = WidgetFactory.createWidget( subButtonContext );

                assertTrue( "Must Be Instance Of Label", widget instanceof Button );
                assertEquals( "Parent Widget Has Correct Child Count", 1, buttonContext.widget.getChildWidgetCount() );
                assertEquals( "Child Is Contained In Parent", widget, buttonContext.widget.getChildWidgets()[ 0 ] );
            });
    };

    this.WidgetFactoryTest.prototype.testCreateButton = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/button", "antie/widgets/label", "antie/declui/widgetfactory"],
            function( application,Button,Label,WidgetFactory) {

                var context = { nodeType : "button", id : "buttonid" };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( widget instanceof Button );
                assertEquals( "buttonid", widget.id );
            });
    };

    this.WidgetFactoryTest.prototype.testCssClassIsAdded = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/button", "antie/widgets/label", "antie/declui/widgetfactory"],
            function( application,Button,Label,WidgetFactory) {

                var context = { nodeType : "button", id : "buttonid", class : "acssclass" };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( widget.hasClass( "acssclass" ) );
            });
    };

    this.WidgetFactoryTest.prototype.testCssClassesAreAdded = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/button", "antie/widgets/label", "antie/declui/widgetfactory"],
            function( application,Button,Label,WidgetFactory) {

                var context = { nodeType : "button", id : "buttonid", class : "acssclass blahclass" };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( widget.hasClass( "acssclass" ) );
                assertTrue( widget.hasClass( "blahclass" ) );
            });
    };

    this.WidgetFactoryTest.prototype.testUpdateWidget = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/button", "antie/widgets/label", "antie/declui/widgetfactory"],
            function( application,Button,Label,WidgetFactory) {

                var button = new Button();
                var label = new Label();

                var buttonContext = { widget : button, nodeType : "button", id : "buttonid" };
                var labelContext = { widget : label, nodeType : "label", id : "labelid", parentContext : buttonContext };

                WidgetFactory.updateWidget( buttonContext );

                assertEquals( 0, button.getChildWidgetCount() );
            });
    };

    this.WidgetFactoryTest.prototype.testCreateButtonCreatesLabelWhenContextHasInnerText = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/button", "antie/widgets/label", "antie/declui/widgetfactory"],
            function( application,Button,Label,WidgetFactory) {

            var context = { nodeType : "button", id : "buttonid", text : "this is a label" };
            var widget = WidgetFactory.createWidget( context );

            assertTrue( "Must Be Instance Of Button", widget instanceof Button );
            assertEquals( "Must Have Correct ID", "buttonid", widget.id );

            var label = widget.getChildWidgets()[ 0 ];

            assertTrue( "Should Be Instance Of Label", label instanceof  Label );
            assertEquals( "Must Have Correct Text", "this is a label", label.getText() );
        });
    };

    this.WidgetFactoryTest.prototype.testCreateLabel = function(queue) {
            queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/button", "antie/widgets/label", "antie/declui/widgetfactory"],
            function(App,Button,Label,WidgetFactory) {
                var context = { nodeType : "label", id : "labelid", text : "this is a label" };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( "Must Be Instance Of Label", widget instanceof Label );
                assertEquals( "Must Have Correct ID", "labelid", widget.id );
                assertEquals( "Must Have Correct Text", "this is a label", widget.getText() );
            });
    };

    this.WidgetFactoryTest.prototype.testCreateImage = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/image", "antie/declui/widgetfactory"],
            function(App,Image,WidgetFactory) {
                var context = { nodeType : "image", id : "imageid" };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( "Must Be Instance Of Image", widget instanceof Image );
                assertEquals( "Must Have Correct ID", "imageid", widget.id );
            });
    };

    this.WidgetFactoryTest.prototype.testCreateImageWithSrcAndSize = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/image", "antie/declui/widgetfactory"],
            function(App,Image,WidgetFactory) {
                var context = { nodeType : "image", id : "imageid", src : "/path/to/image", size : 100 };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( "Must Be Instance Of Image", widget instanceof Image );
                assertEquals( "Must Have Correct ID", "imageid", widget.id );
                assertEquals( "Must Have Correct Src", "/path/to/image", widget._src );
                assertEquals( "Must Have Correct Size", 100, widget._size.width );
                assertEquals( "Must Have Correct Size", 100, widget._size.height );
            });
    };

    this.WidgetFactoryTest.prototype.testCreateHorizontalList = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/horizontallist", "antie/declui/widgetfactory"],
            function(App,HorizontalList,WidgetFactory) {
                var context = { nodeType : "hlist", id : "listid" };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( "Must Be Instance Of HorizontalList", widget instanceof HorizontalList );
                assertEquals( "Must Have Correct ID", "listid", widget.id );
            });
    };

    this.WidgetFactoryTest.prototype.testCreateVerticalList = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/verticallist", "antie/declui/widgetfactory"],
            function(App,VerticalList,WidgetFactory) {
                var context = { nodeType : "vlist", id : "listid" };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( "Must Be Instance Of VerticalList", widget instanceof VerticalList );
                assertEquals( "Must Have Correct ID", "listid", widget.id );
            });
    };

    this.WidgetFactoryTest.prototype.testCreateHorizontalCarousel = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/widgets/horizontalcarousel", "antie/declui/widgetfactory"],
            function(App,HorizontalCarousel,WidgetFactory) {
                var context = { nodeType : "hcarousel", id : "carouselid" };
                var widget = WidgetFactory.createWidget( context );

                assertTrue( "Must Be Instance Of HorizontalCarousel", widget instanceof HorizontalCarousel );
                assertEquals( "Must Have Correct ID", "carouselid", widget.id );
            });
    };

    this.WidgetFactoryTest.prototype.testRegisterHandlerRegistersHandler = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/declui/widgetfactory"],
            function(App,WidgetFactory) {
                var context = { nodeType : "newwidget", id : "newwidgetid" };
                var widget = WidgetFactory.registerHandler( "newwidget", function(){

                } );

                assertTrue( "Handler Must Be Registered", WidgetFactory.handlers[ "newwidget"] !== undefined );
            });
    };

    this.WidgetFactoryTest.prototype.testRegisterHandlerThrowsExceptionIfAlreadyRegistered = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/declui/widgetfactory"],
            function(App,WidgetFactory) {
                var context = { nodeType : "newwidget", id : "newwidgetid" };
                var widget = WidgetFactory.registerHandler( "newwidget", function(){
                } );

                var exceptionThrown = false;
                try{
                    WidgetFactory.registerHandler( "newwidget", function(){} );
                }
                catch( x ){
                    if( x instanceof  WidgetFactory.HandlerAlreadyRegistered ){
                        exceptionThrown = true;
                    }
                }
                assertTrue( "Re-registering Must Throw Exception",exceptionThrown );
            });
    };

    this.WidgetFactoryTest.prototype.testRegisterHandlerThrowsExceptionIfNoHandler = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/declui/widgetfactory"],
            function(App,WidgetFactory) {
                var context = { nodeType : "newwidget", id : "newwidgetid" };

                var exceptionThrown = false;

                try{
                    WidgetFactory.createWidget( context );
                }
                catch( x ){
                    if( x instanceof  WidgetFactory.HandlerNotRegistered ){
                        exceptionThrown = true;
                    }
                }

                assertTrue( "No Handler Registered",exceptionThrown );
            });
    };
})();
