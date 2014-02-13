require.def('antie/declui/eventbinding', [ 'antie/declui/observable' ],
    function( Observable ) {

        function createOnEventWrapper( model, fnCallback ){

            function fnWrapper( evt ){
                fnCallback( evt, model );
            }

            fnWrapper.fnWrappedCallback = fnCallback;

            return fnWrapper;
        }

        var EventBinding = {
            name : "event",

            init : function( binderParams, value ){
                value = Observable.getValue( value );

                binderParams.context.events = {};
                for( var event in value ){
                    if( value.hasOwnProperty( event ) ){
                        var fnCallback = createOnEventWrapper( binderParams.model, value[ event ] );

                        binderParams.context.events[ event ] = fnCallback;
                        binderParams.context.widget.addEventListener( event, fnCallback );
                    }
                }
            },

            update : function( binderParams, value ){
                value = Observable.getValue( value );

                //remove old event handlers
                for( var event in binderParams.context.events ){
                    if( value.hasOwnProperty( event ) ){
                        binderParams.context.widget.removeEventListener( event, binderParams.context.events[ event ] );
                    }
                }

                //add new event handlers
                for( event in value ){
                    if( value.hasOwnProperty( event ) ){
                        var fnCallback = createOnEventWrapper( binderParams.model, value[ event ] );

                        binderParams.context.events[ event ] = fnCallback;
                        binderParams.context.widget.addEventListener( event, fnCallback );
                    }
                }
            }
        };

        return EventBinding;
    }
);
