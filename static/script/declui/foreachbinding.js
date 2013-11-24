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

            init : function( binderParams ){
                var context = binderParams.context;
                context.template = context.children;
            },

            update : function( binderParams ){
                var context = binderParams.context;
                var i;

                context.children = [];
                for( i = 0; i < binderParams.observable().length; i++ ){
                    context.children.push( context.template );
                }
            }
        };

        return ForEachBinding;
    }
);
