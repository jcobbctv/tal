/**
 * x - construct with array
 * x - set new array
 * x - add subscription with context and callback
 * x - can't subscribe twice with same context and callback
 *
 * x - remove subscription
 * alert subscribers on array change with array delta, context object
 * provide some standard array methods, pop, push, shift, etc
 *
 *
 * arrayDelta = {
 *      addedItems : { i : item },
 *      removedItems : []
 * }
 *
 */
require.def('antie/declui/observable-array', [],
    function () {

        var ObservableArrayClass = function (init) {
            var value = init;
            var subscribers = [];

            function findSubscriber( contextObject, callback ){
                var l = subscribers.length;
                for (var i = 0; i < l; i++) {
                    if (subscribers[i].contextObject === contextObject && subscribers[i].callback === callback) {
                        return i;
                    }
                }
                return -1;
            }

            function notifySubscribers( arrayDelta ){
                var l = subscribers.length;
                for (var i = 0; i < l; i++) {
                    subscribers[ i ].callback( subscribers[ i ].contextObject, arrayDelta );
                }
            }

            function arrayToHash( array, from ){

                if( from === undefined ){
                    from = 0;
                }

                var l = array.length;
                var h = {};
                for( var i = from; i < l; i++ ){
                    h[ i ] = array[ i ];
                }
                return h;
            }

            /**
             * Constructs a new observable array
             * @param newValue
             * @returns {*}
             */
            var observable = function (newValue) {
                if (newValue !== undefined) {
                    var arrayDelta = {};

                    arrayDelta.removedItems = arrayToHash( value );
                    arrayDelta.addedItems = arrayToHash( newValue );
                    value = newValue;
                    notifySubscribers( arrayDelta );
                }

                return value;
            };

            /**
             * Adds a subscriber to the observable array
             * @param contextObject
             * @param callback
             */
            observable.subscribe = function (contextObject, callback) {
                if( findSubscriber( contextObject, callback ) !== -1 ){
                    return;
                }

                subscribers.push({ contextObject: contextObject, callback: callback });
            }

            /**
             * Returns the list of current subscribers to this observable array
             * @returns {Array}
             */
            observable.subscribers = function () {
                return subscribers;
            }

            observable.unsubscribe = function (contextObject, callback) {
                var i = findSubscriber( contextObject, callback );

                if( i !== -1 ){
                    subscribers.splice(i, 1);
                }
            }

            observable.pop = function(){
                var arrayDelta = {};

                var removedIndex = value.length - 1;
                var removedValue = value.pop();

                arrayDelta.addedItems = {};
                arrayDelta.removedItems = {};
                arrayDelta.removedItems[ removedIndex ] = removedValue;
                notifySubscribers( arrayDelta );

                return removedValue;
            }

            observable.push = function(){
                var arrayDelta = {};
                var startIndex = value.length;

                Array.prototype.push.apply( value, arguments );

                arrayDelta.removedItems = {};
                arrayDelta.addedItems = arrayToHash( value, startIndex );

                notifySubscribers( arrayDelta );

                return value.length;
            }

            observable.reverse = function(){
                var arrayDelta = {};

                arrayDelta.addedItems = {};
                arrayDelta.removedItems = {};
                arrayDelta.remappedItems = [];

                for( var i = value.length - 1; i >= 0; i-- ){
                    arrayDelta.push( i );
                }

                return value.reverse();
            }


            return observable;
        };

        return ObservableArrayClass;
    }
);
