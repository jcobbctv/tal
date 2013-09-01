
require.def('antie/declui/observable',[],
    function() {

        var findSubscriber = function( callbackContext, callbackFunction ){
            if( callbackFunction === undefined ){
                callbackFunction = callbackContext;
                callbackContext  = undefined;
            }

            for( var i = 0; i < this.subscribers.length; i++ ){
                if( this.subscribers[ i ].callback === callbackFunction &&
                    this.subscribers[ i ].context == callbackContext ){
                    return i;
                }
            }

            return -1;
        }

        var subscribe = function( callbackContext, callbackFunction ){
            //callbackFunction undefined then there is no context and callbackContext actually has callback function
            if( findSubscriber.call( this, callbackContext, callbackFunction )  != -1 ){
                return;
            }

            if( callbackFunction === undefined ){
                this.subscribers.push( { callback : callbackContext } );
            }else{
                this.subscribers.push( { context : callbackContext, callback : callbackFunction } );
            }
        }

        var unsubscribe = function( callbackContext, callbackFunction ){
            var i = findSubscriber.call( this, callbackContext, callbackFunction );

            if( i == -1 ){
                return;
            }

            this.subscribers.splice( i, 1 );
        }

        var notifySubscribers = function( value ){
            for( var i = 0; i < this.subscribers.length; i++ ){
                if( this.subscribers[ i ].callback.length === 1 ){
                    this.subscribers[ i ].callback( value );
                }else{
                    this.subscribers[ i ].callback( this.subscribers[ i ].context, value );
                }
            }
        }

        var ObservableClass = function( init ){
            var value  = init;

            var observable = function( newValue ){
                if( newValue != undefined && newValue != value ){
                    value = newValue;
                    notifySubscribers.call( observable, value );
                }
                return value;
            }

            observable.subscribe   = subscribe.bind( observable );
            observable.unsubscribe = unsubscribe.bind( observable );
            observable.subscribers = [];

            return observable;
        };

        return ObservableClass;
    }
);
