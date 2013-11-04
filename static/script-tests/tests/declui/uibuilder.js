(function() {
    this.UIBuilderTest = AsyncTestCase("UIBuilder");

    this.UIBuilderTest.prototype.testBuildContextTreeBuildsContextTreeStructure = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

            var xmlMarkup = '<view><list><button></button><button></button></list></view>';
            var domParser = new DOMParser();
            var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

            var context = UIBuilder.buildContextTree(  doc.documentElement, null );

            var view = context;
            var list = view.children[ 0 ];
            var btn0 = list.children[ 0 ];
            var btn1 = list.children[ 1 ];

            assertNull( view.parentContext );
            assertEquals( 1, view.children.length );

            assertEquals( view, list.parentContext );
            assertEquals( 2, list.children.length );

            assertEquals( list, btn0.parentContext );
            assertEquals( btn0, list.children[ 0 ] );

            assertEquals( list, btn1.parentContext );
            assertEquals( btn1, list.children[ 1 ] );
        });
    };

    this.UIBuilderTest.prototype.testBuildContextTreeGetsInnerText = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view><list><button>INNERTEXT</button><box></box></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

                var context = UIBuilder.buildContextTree(  doc.documentElement, null );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertEquals( "INNERTEXT", btn0.text );

            });
    };

    this.UIBuilderTest.prototype.testBuildContextTreeGetsNodeType = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view><list><button></button><box></box></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

                var context = UIBuilder.buildContextTree(  doc.documentElement, null );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertEquals( "view", view.nodeType );
                assertEquals( "list", list.nodeType );
                assertEquals( "button", btn0.nodeType );
                assertEquals( "box", btn1.nodeType );
            });
    };

    this.UIBuilderTest.prototype.testBuildContextTreeGetAtrributes= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

                var context = UIBuilder.buildContextTree(  doc.documentElement, null );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertEquals( "view", view.id );
                assertEquals( "hlist", list.class );
                assertEquals( "text:buttonName", btn0.bind );
                assertEquals( "button2", btn1.id );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeCallsCreateWidget= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

                var context = UIBuilder.buildContextTree( doc.documentElement, null );

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {}
                };
                var createWidgetSpy = sinon.spy( params.widgetFactory, "createWidget" );
                var modelAccessor = function(){
                    return {};
                }
                UIBuilder.processContextTree( params, modelAccessor, context );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertTrue( createWidgetSpy.called );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeCallsBinderInitUpdate= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement, null );

                var initContext;
                var updateContext;

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            init : function( binderParams ){
                                initContext = binderParams.context;
                            },
                            update : function( binderParams, observable ){
                                updateContext = binderParams.context;
                            }
                        }
                    }
                };
                var model = { buttonName : new Observable( "myButton" ) };
                var modelAccessor = function(){
                    return model;
                }

                UIBuilder.processContextTree( params, modelAccessor, context );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                modelAccessor().buttonName( "newName" );

                assertEquals( btn0, initContext );
                assertEquals( btn0, updateContext );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeCallsBinderInitWithBoundObservable = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement, null );

                var initObservable;

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            init : function( binderParams ){
                                initObservable = binderParams.observable;
                            },
                        }
                    }
                };

                var model = { buttonName : new Observable( "myButton" ) };
                var modelAccessor = function(){
                    return model;
                }

                UIBuilder.processContextTree( params, modelAccessor, context );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertEquals( model.buttonName, initObservable );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeCallsBinderInitWithModelAccessor = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement, null );


                var initContext;
                var initModelAccessor;
                var updateContext;

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            init : function( binderParams ){
                                initModelAccessor = binderParams.modelAccessor;
                            }
                        }
                    }
                };

                var model = { buttonName : new Observable( "myButton" ) };
                var modelAccessor = function(){
                    return model;
                }

                UIBuilder.processContextTree( params, modelAccessor, context );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertEquals( modelAccessor, initModelAccessor );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeBinderInitChildrenGetsModifiedModelAccessor = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list bind="forEach: buttons" class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement, null );

                var initContext;
                var initModelAccessor;
                var updateContext;
                var forEachModelAccessor;

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        forEach : {
                            init : function( binderParams  ){
                                //return a model accessor that wraps the observable in this case it should be the buttons
                                //array - the buttons within the array should then be able to access the objects within that array
                                forEachModelAccessor = function( index ) { return binderParams.observable[ index ]; };
                                return forEachModelAccessor;
                            }
                        },
                        text : {
                            init : function( binderParams  ){
                                initModelAccessor = binderParams.modelAccessor;
                            },
                        }
                    }
                };

                var model = { buttons : [
                    { buttonName : new Observable( "button1" ) },
                    { buttonName : new Observable( "button2" ) },
                ]  };
                var modelAccessor = function( index ){
                    return model;
                }

                UIBuilder.processContextTree( params, modelAccessor, context );


                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertEquals( forEachModelAccessor, initModelAccessor );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeThrowsUnknownBindingException = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view><list bind="unknown:variable"><button></button><button></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement, null );

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {}
                };
                var model = { variable : 1 };
                var modelAccessor = function(){
                    return model;
                }

                var exceptionThrown = false;
                try{
                    UIBuilder.processContextTree( params, modelAccessor, context )
                }
                catch( x ){
                    if( x instanceof UIBuilder.UIBuilderException ){
                        exceptionThrown = true;
                    }
                }
                assertTrue( exceptionThrown );
            });
    };
})();
