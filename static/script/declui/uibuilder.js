require.def('antie/declui/uibuilder', [ 'antie/declui/binding-parser' ],
    function (BindingParser) {

        var UIBuilder = {};

        UIBuilder.UIBuilderException = function UIBuilderException(message) {
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
            var context         = { children: [], parentContext: parentContext };

            context.nodeType = domElement.nodeName;
            context.text = domElement.textContent;

            for (i = 0; i < domElement.attributes.length; i++) {
                var attrib = domElement.attributes[ i ];

                context[ attrib.name ] = attrib.value;
            }

            for (i = 0; i < domElement.children.length; i++) {
                context.children.push( UIBuilder.buildContextTree( domElement.children[ i ], context ));
            }

            return context;
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
            var model           = modelAccessor(childIndex);
            var childAccessor   = modelAccessor;

            context.widget = uiContext.widgetFactory.createWidget(context);

            if( context.bind ){
                var bindingObject = BindingParser.bindingToObject(model, context.bind);

                for (var binding in bindingObject) {
                    if ( bindingObject.hasOwnProperty( binding ) &&  uiContext.binders[ binding ] ) {

                        var binderParams = {
                          context       : context,
                          observable    : bindingObject[ binding ],
                          modelAccessor : modelAccessor
                        };

                        if (uiContext.binders[ binding ].init) {
                            childAccessor = uiContext.binders[ binding ].init( binderParams );
                        }

                        if (uiContext.binders[ binding ].update) {
                            childAccessor = bindingObject[ binding ].subscribe( binderParams, uiContext.binders[ binding ].update );
                        }
                    } else {
                        throw new UIBuilder.UIBuilderException("unknown binding");
                    }
                }
            }

            for (i = 0; i < context.children.length; i++) {
                UIBuilder.processContextTree( uiContext, childAccessor, context.children[ i ], i );
            }
        }

        return UIBuilder;
    }
);
