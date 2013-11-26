(function() {
    this.ForEachBindingTest = AsyncTestCase("DU.ForEachBindingTest");

    this.ForEachBindingTest.prototype.setUp = function() {
    };

    this.ForEachBindingTest.prototype.tearDown = function() {
    };

    this.ForEachBindingTest.prototype.testForEachBindingHasCorrectName= function(queue) {
        expectAsserts(1);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/foreachbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable-array" ],
            function( App, ForEachBinding, Button, Label, Observable ) {


                assertEquals( "foreach", ForEachBinding.name );
            });
    };

    this.ForEachBindingTest.prototype.testInnerTemplateIsCopiedForTemplate= function(queue) {
        expectAsserts(1);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/foreachbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable-array" ],
            function( App, ForEachBinding, Button, Label, Observable ) {

                var hlist_context = {};

                var button1_context = { nodeType : "button" };
                var label1_context = { nodeType : "label" };
                
                button1_context.children = [ label1_context ];

                var button2_context = { nodeType : "button" };
                var label2_context = { nodeType : "label" };

                button2_context.children = [ label2_context ];

                var expectedTemplate = [ button1_context, button2_context ];

                hlist_context.nodeType = "hlist";
                hlist_context.children = expectedTemplate;

                var binderParams = {};
                binderParams.context = hlist_context;

                ForEachBinding.init( binderParams );

                assertEquals( expectedTemplate, hlist_context.template );
            });
    };

    this.ForEachBindingTest.prototype.testForEachUpdateReturnsCorrectAccessor = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/foreachbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable", "antie/declui/observable-array" ],
            function( App, ForEachBinding, Button, Label, Observable, ObservableArray ) {

                var hlist_context = {};

                var button1_context = { nodeType : "button" };
                var label1_context = { nodeType : "label" };

                button1_context.children = [ label1_context ];

                var expectedTemplate = [ button1_context ];

                hlist_context.nodeType = "hlist";
                hlist_context.children = expectedTemplate;

                var observableList = new ObservableArray(
                    [
                        { name : new Observable( "1" ) },
                        { name : new Observable( "2" ) },
                        { name : new Observable( "3" ) },
                        { name : new Observable( "4" ) }
                    ]
                );

                var binderParams = {};
                binderParams.context = hlist_context;

                var accessor = ForEachBinding.init( binderParams, observableList );
                ForEachBinding.update( binderParams, observableList );

                assertEquals( "1", accessor(0).name() );
                assertEquals( "2", accessor(1).name() );
                assertEquals( "3", accessor(2).name() );
                assertEquals( "4", accessor(3).name() );

            });
    };

    this.ForEachBindingTest.prototype.testForEachBindingClonesSimpleTemplate = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/foreachbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable-array" ],
            function( App, ForEachBinding, Button, Label, ObservableArray ) {

                var hlist_context = {};

                var button1_context = { nodeType : "button" };
                var label1_context = { nodeType : "label" };

                button1_context.children = [ label1_context ];

                var expectedTemplate = [ button1_context ];

                hlist_context.nodeType = "hlist";
                hlist_context.children = expectedTemplate;

                var observableList = new ObservableArray();
                observableList.push( {} );
                observableList.push( {} );
                observableList.push( {} );
                observableList.push( {} );

                var binderParams = {};
                binderParams.context = hlist_context;

                ForEachBinding.init( binderParams, observableList );
                ForEachBinding.update( binderParams, observableList );
                assertEquals( 4, hlist_context.children.length );
                assertNotEquals( binderParams.context.template[ 0 ], hlist_context.children[ 0 ] );
                assertNotEquals( binderParams.context.template[ 1 ], hlist_context.children[ 1 ] );
                assertNotEquals( binderParams.context.template[ 2 ], hlist_context.children[ 2 ] );
                assertNotEquals( binderParams.context.template[ 3 ], hlist_context.children[ 3 ] );
            });
    };


    this.ForEachBindingTest.prototype.testForEachBindingClonesComplexTemplate = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/foreachbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable-array" ],
            function( App, ForEachBinding, Button, Label, ObservableArray ) {

                var hlist_context = {};

                var button1_context = { nodeType : "button" };
                var label1_context = { nodeType : "label" };
                button1_context.children = [ label1_context ];

                var button2_context = { nodeType : "button" };
                var label2_context = { nodeType : "label" };
                button2_context.children = [ label2_context ];

                var expectedTemplate = [ button1_context, button2_context ];

                hlist_context.nodeType = "hlist";
                hlist_context.children = expectedTemplate;

                var observableList = new ObservableArray();
                observableList.push( {} );
                observableList.push( {} );
                observableList.push( {} );
                observableList.push( {} );

                var binderParams = {};
                binderParams.context = hlist_context;

                ForEachBinding.init( binderParams, observableList );
                ForEachBinding.update( binderParams, observableList );
                assertEquals( 8, hlist_context.children.length );
                assertNotEquals( binderParams.context.template[ 0 ], hlist_context.children[ 0 ] );
                assertNotEquals( binderParams.context.template[ 1 ], hlist_context.children[ 1 ] );
                assertNotEquals( binderParams.context.template[ 2 ], hlist_context.children[ 2 ] );
                assertNotEquals( binderParams.context.template[ 3 ], hlist_context.children[ 3 ] );
            });
    };

    this.ForEachBindingTest.prototype.testForEachBindingReturnsTrueOnMutation = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/foreachbinding", "antie/widgets/button", "antie/widgets/label", "antie/declui/observable-array" ],
            function( App, ForEachBinding, Button, Label, ObservableArray ) {

                var hlist_context = {};

                var button1_context = { nodeType : "button" };
                var label1_context = { nodeType : "label" };
                button1_context.children = [ label1_context ];

                var button2_context = { nodeType : "button" };
                var label2_context = { nodeType : "label" };
                button2_context.children = [ label2_context ];

                var expectedTemplate = [ button1_context, button2_context ];

                hlist_context.nodeType = "hlist";
                hlist_context.children = expectedTemplate;

                var observableList = new ObservableArray();
                observableList.push( {} );
                observableList.push( {} );
                observableList.push( {} );
                observableList.push( {} );

                var binderParams = {};
                binderParams.context = hlist_context;

                ForEachBinding.init( binderParams, observableList );
                assertTrue( ForEachBinding.update( binderParams, observableList ) );
            });
    };

})();
