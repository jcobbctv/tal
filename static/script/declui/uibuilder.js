require.def('antie/declui/uibuilder', [ 'antie/declui/binding-parser' ],
    function (BindingParser) {

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

        UIBuilder._handleUpdate = function( uiContext, context, accessorStack, binderParams, bindingObject, binding ){

            var updateProxy = function updateProxy( params, value ){
                var i;
                if( true === uiContext.binders[ binding ].update( params, value ) ){

                    uiContext.widgetFactory.updateWidget( context );

                    for (i = 0; i < context.children.length; i++) {
                        UIBuilder.processContextTree( uiContext, accessorStack, context.children[ i ], i );
                    }
                }
            }

            //if it has a subscribe function it is an observable
            if( bindingObject[ binding ].subscribe ){
                bindingObject[ binding ].subscribe( binderParams, updateProxy );
                uiContext.binders[ binding ].update( binderParams, bindingObject[ binding ] );
            }else{
                //no subscribe - then wrap into observable like accessor
                uiContext.binders[ binding ].update( binderParams, function() { return bindingObject[ binding ]; } );
            }


        }

        /**
         *
         * @param uiContext
         * @param accessorStack
         * @param context
         * @param childIndex
         */
        UIBuilder.processContextTree = function( uiContext, accessorStack, context, childIndex ) {
            var i;

            //the model accessor could be a normal accessor or one from a binder to place a new model context
            var model           = accessorStack[0](childIndex);
            var parentModel     = accessorStack[1] ? accessorStack[1]() : undefined;

            context.widget = uiContext.widgetFactory.createWidget(context);

            if( context.bind ){
                var bindingObject = BindingParser.bindingToObject( parentModel, model, context.bind );

                for (var binding in bindingObject) {
                    if ( bindingObject.hasOwnProperty( binding ) &&  uiContext.binders[ binding ] ) {

                        var binderParams = {
                          context       : context,
                          modelAccessor : accessorStack[ 0 ],
                          widgetFactory : uiContext.widgetFactory
                        };

                        if( uiContext.binders[ binding ].init ) {
                            var returnedAccessor = uiContext.binders[ binding ].init( binderParams, bindingObject[ binding ] );
                            if( returnedAccessor ){
                                accessorStack.unshift( returnedAccessor );
                            }
                        }

                        if (uiContext.binders[ binding ].update ) {
                            this._handleUpdate( uiContext, context, accessorStack, binderParams, bindingObject, binding );
                        }
                    } else {
                        throw new UIBuilder.UnknownBindingException("unknown binding:"  + binding );
                    }
                }
            }

            for( i = 0; i < context.children.length; i++ ) {
                UIBuilder.processContextTree( uiContext, accessorStack, context.children[ i ], i );
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

            function modelAccessor(){
                return params.model;
            }

            if( params.docElement.nodeName !== "view" ){
                throw new UIBuilder.NoViewElementException( "DOM must contain 1 view element" );
            }

            var viewContext = this.buildContextTree( params.docElement );
            this.processContextTree( uiContext, modelAccessor, viewContext, 0 );

            return viewContext;
        }

        return UIBuilder;
    }
);
