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

            cloneContext : function( context, clonedParent ){
                var clone = {};

                for( var prop in context ){
                    //if this is an own property
                    if( context.hasOwnProperty( prop ) ){

                        //this property is the parentContext so set clone.parentContext to clonedParent
                        if( prop === "parentContext" ){
                            clone.parentContext = clonedParent;
                        }else
                        //now for each child in the source object
                        if( prop === "children" ){
                            //create an array to hold the clones
                            clone.children = [];
                            var i;

                            //for each original object
                            for( i = 0; i < context.children.length; i++  ){
                                //create a clone and add to children array
                                clone.children[ i ] = this.cloneContext( context.children[ i ], clone );
                            }
                        }else{
                            //anything else just copy
                            clone[ prop ] = context[ prop ];
                        }
                    }
                }

                return clone;
            },

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
                        context.children.push( this.cloneContext( context.template[ j ], context.template[ j ].parentContext ) );
                    }
                }
                return true;
            }
        };

        return ForEachBinding;
    }
);
