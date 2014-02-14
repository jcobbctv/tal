require.def('antie/declui/disabledbinding', [ 'antie/declui/observable' ],
    function( Observable ) {

        var DisabledBinding = {
//            var binderParams = {
//                context       : context,
//                observable    : bindingObject[ binding ],
//                modelAccessor : modelAccessor
//                widgetFactory : widgetFactory
//            };

            name : "disabled",

            update : function( binderParams, value ){
                value = Observable.getValue( value )
                if( binderParams.context.widget.setDisabled ){
                    binderParams.context.widget.setDisabled( value ? true : false );
                    return;
                }
            }
        };

        return DisabledBinding;
    }
);
