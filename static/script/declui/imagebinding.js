require.def('antie/declui/imagebinding', [ 'antie/declui/observable' ],
    function( Observable ) {

        var ImageBinding = {
//            var binderParams = {
//                context       : context,
//                observable    : bindingObject[ binding ],
//                modelAccessor : modelAccessor
//                widgetFactory : widgetFactory
//            };

            name : "image",

            update : function( binderParams, value ){
                value = Observable.getValue( value )
                if( binderParams.context.widget.setSrc ){
                    binderParams.context.widget.setSrc( value );
                    return;
                }
            }
        };

        return ImageBinding;
    }
);
