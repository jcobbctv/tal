
require.def('antie/declui/pubsub',[],
    function() {

        var PubSub = function(){
            this._subscribers = [];
        };

        var findSubscriber = function( callbackContext, callbackFunction ){
            if( callbackFunction === undefined ){
                callbackFunction = callbackContext;
                callbackContext  = undefined;
            }

            for( var i = 0; i < this._subscribers.length; i++ ){
                if( this._subscribers[ i ].callback === callbackFunction &&
                    this._subscribers[ i ].context == callbackContext ){
                    return i;
                }
            }

            return -1;
        }

        PubSub.prototype.subscribe = function( callbackContext, callbackFunction ){
            //callbackFunction undefined then there is no context and callbackContext actually has callback function
            if( findSubscriber.call( this, callbackContext, callbackFunction )  != -1 ){
                return;
            }

            if( callbackFunction === undefined ){
                this._subscribers.push( { callback : callbackContext } );
            }else{
                this._subscribers.push( { context : callbackContext, callback : callbackFunction } );
            }
        }

        PubSub.prototype.unsubscribe = function( callbackContext, callbackFunction ){
            var i = findSubscriber.call( this, callbackContext, callbackFunction );

            if( i == -1 ){
                return;
            }

            this._subscribers.splice( i, 1 );
        }

        PubSub.prototype.notifySubscribers = function( value ){
            //think about making async
            for( var i = 0; i < this._subscribers.length; i++ ){
                if( this._subscribers[ i ].callback.length === 1 ){
                    this._subscribers[ i ].callback( value );
                }else{
                    this._subscribers[ i ].callback( this._subscribers[ i ].context, value );
                }
            }
        }

        PubSub.accessNotify = function( observable ){
            if( PubSub.accessCallbackFN ){
                PubSub.accessCallbackFN( observable );
            }
        }

        PubSub.startAccessListening = function( callbackFN ){
            PubSub.accessCallbackFN = callbackFN;
        }

        PubSub.stopAccessListening  = function(){
            PubSub.accessCallbackFN = null;
        }

        return PubSub;
    }
);
