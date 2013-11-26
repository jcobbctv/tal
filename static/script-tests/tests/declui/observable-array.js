(function () {

    require( ["antie/declui/observable-array"], function(ObservableArray){
        this.ObservableArrayTest = TestCase("DU.ObservableArray");

        this.ObservableArrayTest.prototype.setUp = function () {
        };

        this.ObservableArrayTest.prototype.tearDown = function () {
        };

        this.ObservableArrayTest.prototype.testWithNoInitVariable = function () {
            var o = new ObservableArray();

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            o.push( 303 );

            assertEquals( [ 303 ], notifiedValue );
        };

        this.ObservableArrayTest.prototype.testPop = function () {
            var o = new ObservableArray([ 303, 404 ]);

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.pop();

            assertEquals( [ 303 ], notifiedValue );
            assertEquals( 404, r );
        };

        this.ObservableArrayTest.prototype.testPush = function () {
            var o = new ObservableArray([ 303, 404 ]);

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var length = o.push( 505, 606 );

            assertEquals( [ 303, 404, 505, 606 ], notifiedValue );
            assertEquals( 4, length );
        };

        this.ObservableArrayTest.prototype.testPush = function () {
            var o = new ObservableArray([ 303, 404 ]);

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var length = o.push( 505, 606 );

            assertEquals( [ 303, 404, 505, 606 ], notifiedValue );
            assertEquals( 4, length );
        };

        this.ObservableArrayTest.prototype.testReverse = function () {
            var o = new ObservableArray([ 303, 404, 505, 606 ]);

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            o.reverse();

            assertEquals( [ 606, 505, 404, 303 ], notifiedValue );
        };

        this.ObservableArrayTest.prototype.testShift = function () {
            var o = new ObservableArray([ 303, 404, 505, 606 ]);

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.shift();

            assertEquals( [ 404, 505, 606 ], notifiedValue );
            assertEquals( 303, r );
        };

        this.ObservableArrayTest.prototype.testSortNoArg = function () {
            var o = new ObservableArray([ 404, 303, 606, 505 ]);

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            o.sort();

            assertEquals( [ 303, 404, 505, 606 ], notifiedValue );
        };

        this.ObservableArrayTest.prototype.testSort = function () {
            var o = new ObservableArray([ 404, 303, 606, 505 ]);

            function sortFunc( a,b ){
                if( a > b ){
                    return -1;
                }else
                if( a < b ){
                    return +1;
                }
                return 0;
            }

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            o.sort( sortFunc );

            assertEquals( [ 606, 505, 404, 303 ], notifiedValue );
        };

        this.ObservableArrayTest.prototype.testSplice = function () {
            var o = new ObservableArray([ 303, 404, 505, 606 ]);

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.splice( 1,2, 808, 909 );

            assertEquals( [ 303, 808, 909, 606 ], notifiedValue );
            assertEquals( [ 404, 505 ], r );
        };

        this.ObservableArrayTest.prototype.testUnshift = function () {
            var o = new ObservableArray([ 303, 404, 505, 606 ]);

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.unshift( 202, 101 );

            assertEquals( [ 202, 101, 303, 404, 505, 606 ], notifiedValue );
            assertEquals( 6, r );
        };

        this.ObservableArrayTest.prototype.testConcatPlainArray = function () {
            var o = new ObservableArray( [ 303, 404, 505, 606 ] );
            var a = [ 707, 808 ];

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.concat( a );

            assertEquals( undefined, notifiedValue );
            assertEquals( [ 303, 404, 505, 606, 707, 808 ], r );
        };

        this.ObservableArrayTest.prototype.testConcatObservableArray = function () {
            var o = new ObservableArray( [ 303, 404, 505, 606 ] );
            var a = new ObservableArray( [ 707, 808 ] );

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.concat( a );

            assertEquals( undefined, notifiedValue );
            assertEquals( [ 303, 404, 505, 606, 707, 808 ], r );
        };

        this.ObservableArrayTest.prototype.testConcatMixed = function () {
            var o = new ObservableArray( [ 303, 404, 505, 606 ] );
            var a = new ObservableArray( [ 707, 808 ] );
            var b = [ 909, 101 ];

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.concat( a, b, 0 );

            assertEquals( undefined, notifiedValue );
            assertEquals( [ 303, 404, 505, 606, 707, 808, 909, 101, 0], r );
        };

        this.ObservableArrayTest.prototype.testJoin = function () {
            var o = new ObservableArray( [ 303, 404, 505, 606 ] );

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.join( "+" );

            assertEquals( undefined, notifiedValue );
            assertEquals( "303+404+505+606", r );
        };

        this.ObservableArrayTest.prototype.testSlice = function () {
            var o = new ObservableArray( [ 303, 404, 505, 606 ] );

            var notifiedValue;
            function notify( observable ){
                notifiedValue = observable();
            }

            o.subscribe( notify );
            var r = o.slice( 1,2 );

            assertEquals( undefined, notifiedValue );
            assertEquals( [ 404 ], r );
        };



    } );
})();
