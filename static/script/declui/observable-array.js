require.def( 'antie/declui/observable-array',[ 'antie/declui/pubsub', 'antie/declui/observable'],
    function( PubSub, Observable ) {

        var ObservableArrayClass = function( init ){
            var value       = init;
            var pubsub      = new PubSub();
            var observable  = new Observable( value );

            observable.pop = function(){
                var r = value.pop();
                this.notify();
                return r;
            }

            observable.push = function(){
                var r = Array.prototype.push.apply( value, arguments );
                this.notify();
                return r;
            }

            observable.reverse = function(){
                value.reverse();
                this.notify();
            }

            observable.shift = function(){
                var r = value.shift();
                this.notify();
                return r;
            }

            observable.sort = function( callback ){
                value.sort( callback );
                this.notify();
            }

            observable.splice = function(){
                var r = Array.prototype.splice.apply( value, arguments );
                this.notify();
                return r;
            }

            observable.unshift = function(){
                var r = Array.prototype.unshift.apply( value, arguments );
                this.notify();
                return r;
            }

            observable.concat = function(){
                for( var i = 0; i < arguments.length; i++ ){
                    if( arguments[ i ].notify ){
                        arguments[ i ] = arguments[ i ]();
                    }
                }

                var r = Array.prototype.concat.apply( value, arguments );
                return r;
            }

            observable.join = function(){
                var r = Array.prototype.join.apply( value, arguments );
                return r;
            }

            observable.slice = function(){
                var r = Array.prototype.slice.apply( value, arguments );
                return r;
            }

            return observable;
        };

        return ObservableArrayClass;
    }
);
