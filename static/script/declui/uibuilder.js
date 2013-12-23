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

        UIBuilder._handleUpdate = function( uiContext, context, childAccessor, binderParams, bindingObject, binding ){

            var updateProxy = function updateProxy( params, value ){
                var i;
                if( true === uiContext.binders[ binding ].update( params, value ) ){

                    uiContext.widgetFactory.updateWidget( context );

                    for (i = 0; i < context.children.length; i++) {
                        UIBuilder.processContextTree( uiContext, childAccessor, context.children[ i ], i );
                    }
                }
            }

            bindingObject[ binding ].subscribe( binderParams, updateProxy );
            uiContext.binders[ binding ].update( binderParams, bindingObject[ binding ] );
        }

        /**
         *
         * @param uiContext
         * @param modelAccessor
         * @param context
         * @param childIndex
         */
        UIBuilder.processContextTree = function( uiContext, modelAccessor, context, childIndex ) {
            var i;

            //this will be the mode for this binding context
            var model           = modelAccessor(childIndex);

            //any children will also get this unless a binder places a new context
            var childAccessor   = function(){ return model; };

            context.widget = uiContext.widgetFactory.createWidget(context);

            if( context.bind ){
                var bindingObject = BindingParser.bindingToObject(model, context.bind);

                for (var binding in bindingObject) {
                    if ( bindingObject.hasOwnProperty( binding ) &&  uiContext.binders[ binding ] ) {

                        var binderParams = {
                          context       : context,
                          modelAccessor : modelAccessor,
                          widgetFactory : uiContext.widgetFactory
                        };

                        if( uiContext.binders[ binding ].init ) {
                            var returnedAccessor = uiContext.binders[ binding ].init( binderParams, bindingObject[ binding ] );
                            if( returnedAccessor ){
                                childAccessor = returnedAccessor;
                            }
                        }

                        if (uiContext.binders[ binding ].update ) {
                            this._handleUpdate( uiContext, context, childAccessor, binderParams, bindingObject, binding );
                        }
                    } else {
                        throw new UIBuilder.UnknownBindingException("unknown binding:"  + binding );
                    }
                }
            }

            for (i = 0; i < context.children.length; i++) {
                UIBuilder.processContextTree( uiContext, childAccessor, context.children[ i ], i );
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
