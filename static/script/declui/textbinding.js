require.def('antie/declui/textbinding',
    function() {

        var TextBinding = {
//            var binderParams = {
//                context       : context,
//                observable    : bindingObject[ binding ],
//                modelAccessor : modelAccessor
//                widgetFactory : widgetFactory
//            };

            update : function( binderParams ){

                if( binderParams.context.widget.setText ){
                    binderParams.context.widget.setText( binderParams.observable() );
                    return;
                }

                var i;
                var childWidgets = binderParams.context.widget.getChildWidgets();

                for( i = 0; i < childWidgets.length; i++ ){
                    if( childWidgets[ i ].setText ){
                        childWidgets[ i ].setText( binderParams.observable() );
                        return;
                    }
                }

                var context = { nodeType : "label", text : binderParams.observable() };

                var label = binderParams.widgetFactory.createWidget( context );
                binderParams.context.widget.appendChildWidget( label );
            }
        };

        return TextBinding;
    }
);
