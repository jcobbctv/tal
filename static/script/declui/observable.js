
require.def( 'antie/declui/observable',[ 'antie/declui/pubsub'],
    function( PubSub ) {

        var ObservableClass = function ObsCstr( init ){
            var value  = init;
            var pubsub = new PubSub();

            var observable = function Observable( newValue ){
                if( newValue != undefined && newValue != value ){
                    value = newValue;
                    pubsub.notifySubscribers( observable );
                }
                return value;
            }

            observable.notify = function(){
                pubsub.notifySubscribers( observable );
            }
            observable.subscribe   = pubsub.subscribe.bind( pubsub );
            observable.unsubscribe = pubsub.unsubscribe.bind( pubsub );

            return observable;
        };

        return ObservableClass;
    }
);
