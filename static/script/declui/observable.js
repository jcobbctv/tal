
require.def( 'antie/declui/observable',[ 'antie/declui/pubsub'],
    function( PubSub ) {

        var ObservableClass = function( init ){
            var value  = init;
            var pubsub = new PubSub();

            var observable = function( newValue ){
                if( newValue != undefined && newValue != value ){
                    value = newValue;
                    pubsub.notifySubscribers( value );
                }
                return value;
            }

            observable.subscribe   = pubsub.subscribe.bind( pubsub );
            observable.unsubscribe = pubsub.unsubscribe.bind( pubsub );

            return observable;
        };

        return ObservableClass;
    }
);
