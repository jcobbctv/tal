
require.def( 'antie/declui/observable',[ 'antie/declui/pubsub'],
    function( PubSub ) {

        var ObservableClass = function ObsCstr( init ){
            var value  = init;
            var pubsub = new PubSub();
            var observable = function Observable( newValue ){
                if( newValue !== undefined && newValue !== value ){
                    value = newValue;
                    observable.value = newValue;
                    pubsub.notifySubscribers( observable );
                }
                return value;
            }

            observable.value = value;

            observable.notify = function(){
                pubsub.notifySubscribers( observable );
            }
            observable.pubsub = pubsub;
            observable.subscribe   = pubsub.subscribe.bind( pubsub );
            observable.unsubscribe = pubsub.unsubscribe.bind( pubsub );

            return observable;
        };

        ObservableClass.isObservableType = function( thing ){
            if( thing.pubsub && thing.pubsub instanceof PubSub )
                return true;

            return false;
        }

        ObservableClass.getValue = function( thing ){
            if( ObservableClass.isObservableType( thing ) ){
                return thing();
            }

            return thing;
        }


        return ObservableClass;
    }
);
