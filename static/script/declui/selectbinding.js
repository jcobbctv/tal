require.def('antie/declui/selectbinding',
    function() {

        var SelectBinding = {
//            var binderParams = {
//                context       : context,
//                observable    : bindingObject[ binding ],
//                modelAccessor : modelAccessor
//                widgetFactory : widgetFactory
//            };

            name : "select",

            init : function( binderParams, value ){
                binderParams.context.onSelect = value();
                binderParams.context.widget.addEventListener( "select", value() );
            },

            update : function( binderParams, value ){
                binderParams.context.widget.removeEventListener( "select", binderParams.context.onSelect );
                binderParams.context.widget.addEventListener( "select", value() );
            }
        };

        return SelectBinding;
    }
);
