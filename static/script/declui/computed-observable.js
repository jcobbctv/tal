
require.def( 'antie/declui/computed-observable',[ 'antie/declui/pubsub'],
    function( PubSub ) {

        var ComputedClass = function ObsCstr( computeFN ){
            var pubsub = new PubSub();

            var observable = function ComputedObservable(){

                //start listening for any accessed observables
                PubSub.startAccessListening( function( accessedObs ){
                    //if an observable is accessed then subscribe to this observable
                    accessedObs.subscribe( observable.notify );
                });

                var rv = computeFN();

                PubSub.stopAccessListening();

                return rv;
            }

            observable.notify = function(){
                pubsub.notifySubscribers( observable );
            }
            observable.pubsub = pubsub;
            observable.subscribe   = pubsub.subscribe.bind( pubsub );
            observable.unsubscribe = pubsub.unsubscribe.bind( pubsub );

            observable();

            return observable;
        };

        return ComputedClass;
    }
);
