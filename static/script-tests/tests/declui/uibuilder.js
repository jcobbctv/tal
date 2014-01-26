(function() {
    this.UIBuilderTest = AsyncTestCase("DU.UIBuilder");

    this.UIBuilderTest.prototype.testBuildContextTreeBuildsContextTreeStructure = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

            var xmlMarkup = '<view><list><button></button><button></button></list></view>';
            var domParser = new DOMParser();
            var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

            var context = UIBuilder.buildContextTree(  doc.documentElement );

            var view = context;
            var list = view.children[ 0 ];
            var btn0 = list.children[ 0 ];
            var btn1 = list.children[ 1 ];

            assertUndefined( view.parentContext );
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

                var context = UIBuilder.buildContextTree(  doc.documentElement );

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

                var context = UIBuilder.buildContextTree(  doc.documentElement );

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

                var context = UIBuilder.buildContextTree(  doc.documentElement );

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

    this.UIBuilderTest.prototype.testBuildContextTreeReturnsViewContext = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

                var context = UIBuilder.buildContextTree( doc.documentElement );
                var view = context;

                assertEquals( "view", context.id );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeCallsCreateWidget= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

                var context = UIBuilder.buildContextTree( doc.documentElement );

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {}
                };
                var createWidgetSpy = sinon.spy( params.widgetFactory, "createWidget" );
                var accessorStack = [ function( index ){ return {}; } ];

                UIBuilder.processContextTree( params, accessorStack, context, 0 );

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

                var xmlMarkup = '<view id="view"><button bind="text:buttonName"><button></button></button></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

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

                var initSpy       = sinon.spy( params.binders.text, "init" );
                var updateSpy     = sinon.spy( params.binders.text, "update" );
                var pctSpy        = sinon.spy( UIBuilder, "processContextTree" );
                var model         = { buttonName : new Observable( "myButton" ) };
                var accessorStack = [ function( index ){ return model; } ];

                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                accessorStack[0]().buttonName( "newName" );

                assertTrue( initSpy.calledOnce );
                assertTrue( pctSpy.calledThrice );
                assertTrue( updateSpy.calledTwice );

                initSpy.restore();
                updateSpy.restore();
                pctSpy.restore();
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeCallsBinderInitUpdateWithWidgetFactoryInParams= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var initWidgetFactory;
                var updateWidgetFactory;

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            init : function( binderParams ){
                                initWidgetFactory = binderParams.widgetFactory;
                            },
                            update : function( binderParams, observable ){
                                updateWidgetFactory = binderParams.widgetFactory;
                            }
                        }
                    }
                };
                var model = { buttonName : new Observable( "myButton" ) };
                var accessorStack = [ function( index ){ return model; } ];


                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                accessorStack[0]().buttonName( "newName" );

                assertEquals( params.widgetFactory, initWidgetFactory );
                assertEquals( params.widgetFactory, updateWidgetFactory );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeAddSubscriptionToObservable= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var updateContext;
                var model = { buttonName : new Observable( "myButton" ) };

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            update : function( binderParams, observable ){
                                updateContext = binderParams.context;
                            }
                        }
                    }
                };
                var accessorStack = [ function( index ){ return model; } ];

                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                //jstestdriver.console.log( model.buttonName.pubsub._subscribers[ 0 ].callback.toString() );
                assertEquals( "updateProxy", model.buttonName.pubsub._subscribers[ 0 ].callback.name );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeHandleLiteralsInBinding= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],

            function(UIBuilder,Observable) {
                expectAsserts( 1 );


                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:\'buttonName\'"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var updateValue;
                var model = { buttonName : new Observable( "myButton" ) };

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            update : function( binderParams, observable ){
                                updateValue = observable;
                            }
                        }
                    }
                };
                var accessorStack = [ function( index ){ return model; } ];
                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                //jstestdriver.console.log( model.buttonName.pubsub._subscribers[ 0 ].callback.toString() );
                assertEquals( "buttonName", updateValue() );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeHandlesNonObservablesInModel= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],

            function(UIBuilder,Observable) {
                expectAsserts( 1 );


                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var updateValue;
                var model = { buttonName : "buttonName" };

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            update : function( binderParams, observable ){
                                updateValue = observable;
                            }
                        }
                    }
                };
                var accessorStack = [ function( index ){ return model; } ];

                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                //jstestdriver.console.log( model.buttonName.pubsub._subscribers[ 0 ].callback.toString() );
                assertEquals( "buttonName", updateValue() );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeCallsBinderUpdateFirstTimeWithoutObservableUpdate= function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var updateContext;
                var model = { buttonName : new Observable( "myButton" ) };

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            update : function( binderParams, observable ){
                                updateContext = binderParams.context;
                            }
                        }
                    }
                };
                var accessorStack = [ function( index ){ return model; } ];


                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                accessorStack[0]().buttonName( "newName" );

                assertEquals( btn0, updateContext );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeCallsBinderInitWithBoundObservable = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var initObservable;

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        text : {
                            init : function( binderParams, value ){
                                initObservable = value;
                            },
                        }
                    }
                };

                var model = { buttonName : new Observable( "myButton" ) };
                var accessorStack = [ function( index ){ return model; } ];

                UIBuilder.processContextTree( params, accessorStack, context, 0 );

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
                var context = UIBuilder.buildContextTree( doc.documentElement );


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
                var accessorStack = [ function( index ){ return model; } ];

                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertSame( accessorStack[0](), initModelAccessor() );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeBinderInitChildrenGetsModifiedModelAccessor = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable", "antie/declui/observable-array"],
            function(UIBuilder,Observable,ObservableArray) {

                var xmlMarkup = '<view id="view"><list bind="forEach: buttons" class="hlist"><button bind="text:buttonName"></button><button id="button2" bind="text:$parent.parentName"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var initContext;
                var initModelAccessor;
                var updateContext;
                var forEachModelAccessor;

                var model = { parentName : "parentName",
                    buttons : new ObservableArray( [
                    { buttonName : new Observable( "button1" ) },
                    { buttonName : new Observable( "button2" ) },
                ] ) };

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        forEach : {
                            init : function( binderParams, value ){
                                //return a model accessor that wraps the observable in this case it should be the buttons
                                //array - the buttons within the array should then be able to access the objects within that array
                                forEachModelAccessor = function( index ) { return value()[ index ] };
                                return forEachModelAccessor;
                            }
                        },
                        text : {
                            init : function( binderParams, value ){
                                jstestdriver.console.log( value() );
                                initModelAccessor = binderParams.modelAccessor;
                            }
                        }
                    }
                };

                var accessorStack = [ function( index ){ return model; } ];

                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                assertEquals( forEachModelAccessor, initModelAccessor );
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeBinderInitChildrenGetsUnmodifiedModelAccessorIfNoReturn = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view id="view"><list bind="forEach: buttons" class="hlist"><button bind="text:buttonName"></button><button id="button2"></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var initModelAccessor;
                var textModelAccessor;

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {
                        forEach : {
                            init : function( binderParams  ){
                                //return a model accessor that wraps the observable in this case it should be the buttons
                                //array - the buttons within the array should then be able to access the objects within that array
                                initModelAccessor = binderParams.modelAccessor;
                            }
                        },
                        text : {
                            init : function( binderParams  ){
                                textModelAccessor = binderParams.modelAccessor;
                            }
                        }
                    }
                };

                var model = { buttonName : "buttonName",
                    buttons : [
                    { buttonName : new Observable( "button1" ) },
                    { buttonName : new Observable( "button2" ) }
                ]  };

                var accessorStack = [ function( index ){ return model; } ];

                UIBuilder.processContextTree( params, accessorStack, context, 0 );


                var view = context;
                var list = view.children[ 0 ];
                var btn0 = list.children[ 0 ];
                var btn1 = list.children[ 1 ];

                assertSame( initModelAccessor(), textModelAccessor() );
            });
    };

    this.UIBuilderTest.prototype.testProcessContextTreeCallsUpdateWidgetWhenBinderUpdateReturnsTrue = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable", "antie/declui/observable-array" ],
            function(UIBuilder,Observable,ObservableArray) {

                var xmlMarkup = '<view><vlist bind="forEach: buttons"><button bind="text:buttonName"></button></vlist></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var params = {
                    widgetFactory :
                    {
                        createWidget : function(){},
                        updateWidget : function(){}
                    },
                    binders : {
                        forEach : {
                            init : function( binderParams, value  ){
                                return function( index ){ return value()[ index ]; };
                            },

                            update : function( binderParams, value ){
                                return true;
                            }
                        },
                        text : {
                            init : function( binderParams, value ){
                            }
                        }
                    }
                };

                var model = {
                    buttons : new ObservableArray( [
                        { buttonName : new Observable( "button1" ) },
                        { buttonName : new Observable( "button2" ) }
                    ] )  };
                var accessorStack = [ function( index ){ return model; } ];


                var updateWidgetSpy = sinon.spy( params.widgetFactory, "updateWidget" );

                UIBuilder.processContextTree( params, accessorStack, context, 0 );

                model.buttons.pop();

                assertTrue( updateWidgetSpy.calledOnce );
                assertTrue( updateWidgetSpy.args[ 0 ][ 0 ].nodeType === "vlist" );




                updateWidgetSpy.restore();
            });
    };

    this.UIBuilderTest.prototype.testPreprocessContextTreeThrowsUnknownBindingException = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view><list bind="unknown:variable"><button></button><button></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );
                var context = UIBuilder.buildContextTree( doc.documentElement );

                var params = {
                    widgetFactory : { createWidget : function(){} },
                    binders : {}
                };
                var model = { variable : 1 };
                var accessorStack = [ function( index ){ return model; } ];

                var exceptionThrown = false;
                try{
                    UIBuilder.processContextTree( params, accessorStack, context, 0 )
                }
                catch( x ){
                    if( x instanceof UIBuilder.UnknownBindingException ){
                        exceptionThrown = true;
                    }
                }
                assertTrue( exceptionThrown );
            });
    };

    this.UIBuilderTest.prototype.testBuildUIFromXMLDomThrowsNoViewException = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<list><button></button><button></button></list>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

                var bctMock = sinon.stub( UIBuilder, "buildContextTree" );
                var pctMock = sinon.stub( UIBuilder, "processContextTree" );

                var model = {
                    item : new Observable( 101 )
                };

                var accessorStack = [ function( index ){ return model; } ];

                var exceptionThrown = false;
                try{
                    var context = UIBuilder.buildUIFromXMLDom(
                        { model : model, docElement : doc.documentElement, binders : [], widgetFactory : {} } );
                }
                catch( x ){
                    if( x instanceof UIBuilder.NoViewElementException ){
                        exceptionThrown = true;
                    }
                }
                assertTrue( exceptionThrown );
            });
    };

    this.UIBuilderTest.prototype.testBuildUIFromXMLDom = function(queue) {
        queuedRequire(queue, ["antie/declui/uibuilder", "antie/declui/observable"],
            function(UIBuilder,Observable) {

                var xmlMarkup = '<view><list><button></button><button></button></list></view>';
                var domParser = new DOMParser();
                var doc = domParser.parseFromString( xmlMarkup, "text/xml" );

                var bctMock = sinon.stub( UIBuilder, "buildContextTree" );
                var pctMock = sinon.stub( UIBuilder, "processContextTree" );

                var viewContext = { nodeType : "view" };

                bctMock.returns( viewContext );

                var model = {
                  item : new Observable( 101 )
                };

                function modelAccessor(){
                    return model;
                }

                var context = UIBuilder.buildUIFromXMLDom(
                    { model : model, docElement : doc.documentElement, binders : [], widgetFactory : {} } );

                uiContext = {
                    widgetFactory:{},
                    binders:[]
                };

                assertEquals( undefined, context.widget );
                assertEquals( "view", context.nodeType );
                assertTrue( bctMock.calledOnce );
                assertTrue( bctMock.calledWithExactly( doc.documentElement ) );

                assertTrue( pctMock.calledOnce );
                assertEquals( uiContext, pctMock.args[ 0 ][ 0 ] );
                assertEquals( model, pctMock.args[ 0 ][ 1 ]() );
                assertEquals( viewContext, pctMock.args[ 0 ][ 2 ] );
                assertEquals( 0, pctMock.args[ 0 ][ 3 ] );

                bctMock.restore();
                pctMock.restore();
            });
    };

})();
