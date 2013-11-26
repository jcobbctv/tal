require.def('antie/declui/foreachbinding',
    function() {

        var ForEachBinding = {
//            var binderParams = {
//                context       : context,
//                observable    : bindingObject[ binding ],
//                modelAccessor : modelAccessor
//                widgetFactory : widgetFactory
//            };

            name : "foreach",

            init : function( binderParams, value ){
                var context = binderParams.context;
                context.template = context.children;

                return function( index ){ return value()[ index ]; };
            },

            update : function( binderParams, value ){
                var context = binderParams.context;
                var i,j;

                context.children = [];
                for( i = 0; i < value().length; i++ ){
                    for( j = 0; j < context.template.length; j++ ){
                        context.children.push( Object.create( context.template[ j ] ) );
                    }
                }
                return true;
            }
        };

        return ForEachBinding;
    }
);
