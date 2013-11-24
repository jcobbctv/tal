(function() {
    this.ForEachBindingTest = AsyncTestCase("ForEachBindingTest");

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

    this.ForEachBindingTest.prototype.testForEachBuildsCorrectContextTreeFromObservable = function(queue) {
        expectAsserts(1);
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
                binderParams.observable = observableList;

                ForEachBinding.init( binderParams );
                ForEachBinding.update( binderParams );
                assertEquals( 4, hlist_context.children.length );
            });
    };
})();
