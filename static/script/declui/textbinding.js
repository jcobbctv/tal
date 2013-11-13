require.def('antie/declui/textbinding',
    function() {

        var TextBinding = {
//            var binderParams = {
//                context       : context,
//                observable    : bindingObject[ binding ],
//                modelAccessor : modelAccessor
//            };

            update : function( binderParams ){
                if( binderParams.context.widget.setText ){
                    binderParams.context.widget.setText( binderParams.observable() );
                }else{
                    var i;

                    for( i = 0; i < )


                    var label = new Label( binderParams.observable() );
                }

            }
        };

        return TextBinding;
    }
);
