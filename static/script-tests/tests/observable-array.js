/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

(function () {

    require( ["antie/declui/observable-array"], function(ObservableArray){
        this.ObservableArrayTest = TestCase("ObservableArray");

        this.ObservableArrayTest.prototype.setUp = function () {
        };

        this.ObservableArrayTest.prototype.tearDown = function () {
        };


        this.ObservableArrayTest.prototype.testConstructionWithArray = function () {
            var o = new ObservableArray([ 303 ]);
            assertEquals([ 303 ], o());
        };

        this.ObservableArrayTest.prototype.testSetNewArray = function () {
            var o = new ObservableArray([ 404 ]);
            o([ 303 ]);
            assertEquals( [ 303 ], o() );
        };

        this.ObservableArrayTest.prototype.testAddSubscriber = function () {
            var o = new ObservableArray([ 404 ]);

            var contextObject = { property: "test" };
            var callback = function(contextObject, arrayDelta, observableArray) {
                return true;
            };

            o.subscribe(contextObject, callback);
            assertEquals( o.subscribers()[ 0 ].contextObject, contextObject );
            assertEquals( o.subscribers()[ 0 ].callback, callback );
        };

        this.ObservableArrayTest.prototype.testCantSubscribeTwiceWithSameContextAndCallback = function () {
            var o = new ObservableArray([ 404 ]);

            var contextObject = { property: "test" };
            var callback = function(contextObject, arrayDelta, observableArray) {
                return true;
            };

            o.subscribe(contextObject, callback);
            o.subscribe(contextObject, callback);

            assertEquals( 1, o.subscribers().length );
        };

        this.ObservableArrayTest.prototype.testRemoveSubscriber = function () {
            var o = new ObservableArray([ 404 ]);

            var contextObject = { property: "test" };
            var callback = function(contextObject, arrayDelta, observableArray) {
                return true;
            };

            var contextObject2 = { property: "test2" };
            var callback2 = function(contextObject, arrayDelta, observableArray) {
                return true;
            };

            o.subscribe(contextObject, callback);
            o.subscribe(contextObject2, callback2);

            o.unsubscribe(contextObject, callback);

            assertEquals( 1, o.subscribers().length );
            assertEquals( o.subscribers()[ 0 ].contextObject, contextObject2 );
            assertEquals( o.subscribers()[ 0 ].callback, callback2 );
        };

        this.ObservableArrayTest.prototype.testSetNewArrayNotifiesSubscribers = function () {
            var o = new ObservableArray([ 404 ]);

            var contextObject = { property: "test" };
            var callback = sinon.stub();

            o.subscribe(contextObject, callback);

            o( [ 303 ] );

            assertTrue( callback.calledOnce );
        };

        this.ObservableArrayTest.prototype.testSetNewArrayNotifiesSubscribersHasCorrectArrayDelta = function () {
            var o = new ObservableArray([ 404,303,202,101 ]);

            var contextObject = { property: "test" };
            var callback = sinon.spy();

            o.subscribe(contextObject, callback);

            o( [ 505,606 ] );

            var removedItems = { 0 : 404, 1 : 303, 2 : 202, 3 : 101  };
            var addedItems = { 0 : 505, 1 : 606 };

            //assertTrue( callback.calledOnce );
            assertTrue( callback.calledWith( contextObject, { removedItems : removedItems, addedItems : addedItems } ) );
        };

        this.ObservableArrayTest.prototype.testPopRemovesLast = function () {
            var o = new ObservableArray([ 404,303,202,101 ]);
            assertEquals( 101, o.pop() );
            assertEquals( [ 404, 303, 202 ], o() );
        };

        this.ObservableArrayTest.prototype.testPopNotifiesSubscribersHasCorrectArrayDelta = function () {
            var o = new ObservableArray([ 404,303,202,101 ]);

            var contextObject = { property: "test" };
            var callback = sinon.spy();

            o.subscribe(contextObject, callback);

            o.pop();

            var removedItems = { 3 : 101  };
            var addedItems = {};

            assertTrue( callback.calledWith( contextObject, { removedItems : removedItems, addedItems : addedItems } ) );
        };

        this.ObservableArrayTest.prototype.testPushAddsToEnd = function () {
            var o = new ObservableArray([ 404,303,202,101 ]);
            assertEquals( 6, o.push( 606, 707 ) );
            assertEquals( [ 404, 303, 202, 101, 606, 707 ], o() );
        };

        this.ObservableArrayTest.prototype.testPushNotifiesSubscribersHasCorrectArrayDelta = function () {
            var o = new ObservableArray([ 404,303,202,101 ]);

            var contextObject = { property: "test" };
            var callback = sinon.spy();

            o.subscribe(contextObject, callback);

            o.push( 606, 707 );

            var removedItems = {};
            var addedItems = { 4 : 606, 5 : 707 };

            assertTrue( callback.calledWith( contextObject, { removedItems : removedItems, addedItems : addedItems } ) );
        };

        this.ObservableArrayTest.prototype.testReverse = function () {
            var o = new ObservableArray([ 404,303,202,101 ]);
            assertEquals( [ 101, 202, 303, 404 ], o.reverse() );
            assertEquals( [ 101, 202, 303, 404 ], o() );
        };

        this.ObservableArrayTest.prototype.testReverseNotifiesSubscribersHasCorrectArrayDelta = function () {
            var o = new ObservableArray([ 404,303,202,101 ]);

            var contextObject = { property: "test" };
            var callback = sinon.spy();

            o.subscribe(contextObject, callback);
            o.reverse();

            var removedItems    = {};
            var addedItems      = {};
            var remappedItems   = [ ]

            assertTrue( callback.calledWith( contextObject, { removedItems : removedItems, addedItems : addedItems } ) );
        };
    } );
})();
