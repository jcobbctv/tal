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

    this.ForEachBindingTest.prototype.testForEachBindingCloneContextClones = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/foreachbinding" ],
            function( App, ForEachBinding ) {

                var object0 = {
                    parentContext : null,
                    children : [],
                    attr0 : "attribute0",
                    attr1 : "attribute1"
                };

                var object00 = {
                    parentContext : object0,
                    children : [],
                    attr0 : "attribute00-0",
                    attr1 : "attribute00-1"
                };

                var object01 = {
                    parentContext : object0,
                    children : [],
                    attr0 : "attribute01-0",
                    attr1 : "attribute01-1"
                };

                var object010 = {
                    parentContext : object01,
                    children : [],
                    attr0 : "attribute010-0",
                    attr1 : "attribute010-1"
                };

                object0.children.push( object00 );
                object0.children.push( object01 );
                object01.children.push( object010 );

                var cloned0 = ForEachBinding.cloneContext( object0, null );

                var cloned00 = cloned0.children[ 0 ];
                var cloned01 = cloned0.children[ 1 ];

                var cloned010 = cloned01.children[ 0 ];

                //cloned0
                assertEquals( object0.parentContext, cloned0.parentContext );
                assertEquals( cloned00, cloned0.children[ 0 ] );
                assertEquals( cloned01, cloned0.children[ 1 ] );
                assertEquals( "attribute0", cloned0.attr0 );
                assertEquals( "attribute1", cloned0.attr1 );

                //cloned00
                assertEquals( cloned0, cloned00.parentContext );
                assertEquals( 0, cloned00.children.length );
                assertEquals( "attribute00-0", cloned00.attr0 );
                assertEquals( "attribute00-1", cloned00.attr1 );

                //cloned01
                assertEquals( cloned0, cloned01.parentContext );
                assertEquals( 1, cloned01.children.length );
                assertEquals( cloned010, cloned01.children[ 0 ] );
                assertEquals( "attribute01-0", cloned01.attr0 );
                assertEquals( "attribute01-1", cloned01.attr1 );

                //cloned010
                assertEquals( cloned01, cloned010.parentContext );
                assertEquals( 0, cloned010.children.length );
                assertEquals( "attribute010-0", cloned010.attr0 );
                assertEquals( "attribute010-1", cloned010.attr1 );
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

                var model = ForEachBinding.init( binderParams, observableList );
                ForEachBinding.update( binderParams, observableList );

                assertEquals( "1", model[0].name() );
                assertEquals( "2", model[1].name() );
                assertEquals( "3", model[2].name() );
                assertEquals( "4", model[3].name() );

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
                assertNotSame( binderParams.context.template[ 0 ], hlist_context.children[ 0 ] );
                assertNotSame( binderParams.context.template[ 0 ], hlist_context.children[ 1 ] );
                assertNotSame( binderParams.context.template[ 0 ], hlist_context.children[ 2 ] );
                assertNotSame( binderParams.context.template[ 0 ], hlist_context.children[ 3 ] );
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
                assertNotSame( binderParams.context.template[ 0 ], hlist_context.children[ 0 ] );
                assertNotSame( binderParams.context.template[ 1 ], hlist_context.children[ 1 ] );

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
