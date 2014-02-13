require.def('antie/declui/uibuilder', [ 'antie/declui/binding-parser', 'antie/declui/observable', 'antie/declui/bindingdata-stack' ],
    function (BindingParser, Observable, BindingDataStack ) {

        var UIBuilder = {};

        UIBuilder.UnknownBindingException = function UnknownBindingException(message) {
            this.message = message;
        }

        UIBuilder.NoViewElementException = function NoViewElementException(message) {
            this.message = message;
        }

        /**
         *
         * @param domElement
         * @param parentContext
         * @returns {{children: Array, parentContext: *}}
         */
        UIBuilder.buildContextTree = function( domElement, parentContext ) {
            var i;
            var context = { children: [], parentContext: parentContext };

            context.nodeType = domElement.nodeName;

            if( domElement.children.length === 0 ){
                context.text = domElement.textContent;
            }

            for (i = 0; i < domElement.attributes.length; i++) {
                var attrib = domElement.attributes[ i ];

                context[ attrib.name ] = attrib.value;
            }

            for (i = 0; i < domElement.children.length; i++) {
                context.children.push( UIBuilder.buildContextTree( domElement.children[ i ], context ));
            }

            return context;
        }

        UIBuilder._handleUpdate = function( uiContext, context, bindingDataStack, binderParams, bindingObject, binding ){

            var updateProxy = function updateProxy( params, value ){
                var i;
                if( true === uiContext.binders[ binding ].update( params, value ) ){

                    uiContext.widgetFactory.updateWidget( context );

                    var bindingModel = bindingDataStack.getModel();

                    for (i = 0; i < context.children.length; i++) {
                        if( bindingModel instanceof Array ){
                            UIBuilder.processContextTree( uiContext, bindingDataStack.extend( bindingModel[ i ] ), context.children[ i ] );
                        }else{
                            UIBuilder.processContextTree( uiContext, bindingDataStack, context.children[ i ] );
                        }
                    }
                }
            }

            //if it has a subscribe function it is an observable
            if( Observable.isObservableType( bindingObject[ binding ] ) ){
                bindingObject[ binding ].subscribe( binderParams, updateProxy );
                uiContext.binders[ binding ].update( binderParams, bindingObject[ binding ] );
            }else{
                //no subscribe - then wrap into observable like accessor
                uiContext.binders[ binding ].update( binderParams, bindingObject[ binding ] );
            }
        }

        /**
         *
         * @param uiContext
         * @param modelAccessor
         * @param context
         * @param childIndex
         */
        UIBuilder.processContextTree = function( uiContext, bindingDataStack, context ) {
            var i;

            var newBindingData;

            context.widget = uiContext.widgetFactory.createWidget(context);

            if( context.bind ){
                var bindingObject = BindingParser.bindingToObject( bindingDataStack, context.bind);

                for (var binding in bindingObject) {
                    if ( bindingObject.hasOwnProperty( binding ) &&  uiContext.binders[ binding ] ) {

                        var binderParams = {
                          context       : context,
                          model         : bindingDataStack.getModel(),
                          widgetFactory : uiContext.widgetFactory
                        };

                        if( uiContext.binders[ binding ].init ) {
                            newBindingData = uiContext.binders[ binding ].init( binderParams, bindingObject[ binding ] );
                        }

                        if (uiContext.binders[ binding ].update ) {

                            if( newBindingData ){
                                this._handleUpdate( uiContext, context, bindingDataStack.extend( newBindingData ), binderParams, bindingObject, binding );
                            }else{
                                this._handleUpdate( uiContext, context, bindingDataStack, binderParams, bindingObject, binding );
                            }
                        }
                    } else {
                        throw new UIBuilder.UnknownBindingException("unknown binding:"  + binding );
                    }
                }
            }

            for (i = 0; i < context.children.length; i++) {
                if( newBindingData ){
                    if( newBindingData instanceof Array ){
                        UIBuilder.processContextTree( uiContext, bindingDataStack.extend( newBindingData[ i ] ), context.children[ i ] );
                    }else{
                        UIBuilder.processContextTree( uiContext, bindingDataStack.extend( newBindingData ), context.children[ i ] );
                    }
                }else{
                    UIBuilder.processContextTree( uiContext, bindingDataStack, context.children[ i ] );
                }
            }
        }

        /**
         *
         * @param model
         * @param docElement
         * @param binders
         * @param widgetFactory
         */
        UIBuilder.buildUIFromXMLDom = function( params ){
            var uiContext = {
                widgetFactory:params.widgetFactory,
                binders:params.binders
            };

            if( params.docElement.nodeName !== "view" ){
                throw new UIBuilder.NoViewElementException( "DOM must contain 1 view element" );
            }

            var viewContext = this.buildContextTree( params.docElement );
            var bindingDataStack = new BindingDataStack( params.model );

            this.processContextTree( uiContext, bindingDataStack, viewContext, 0 );

            return viewContext;
        }

        return UIBuilder;
    }
);
