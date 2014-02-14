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

(function() {
	this.ObservableTest = AsyncTestCase("DU.ObservableValue");

	this.ObservableTest.prototype.setUp = function() {
	};

	this.ObservableTest.prototype.tearDown = function() {
	};


    this.ObservableTest.prototype.testConstruction = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/observable","antie/class"], function(Observable, Class) {
            var o = new Observable( 303 );
            assertEquals( 303, o() );
        });
    };

    this.ObservableTest.prototype.testValueSetIsValueReturned = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/observable","antie/class"], function(Observable, Class) {
            var o = new Observable();
            o( "badoooosh" );
            assertEquals( "badoooosh", o() );
        });
    };

    this.ObservableTest.prototype.testIsObservableType = function(queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/declui/observable","antie/class"], function(Observable, Class) {
            var o = new Observable();
            o( "badoooosh" );

            var no = 1;

            assertEquals( true, Observable.isObservableType( o ) );
            assertEquals( false, Observable.isObservableType( no ) );
        });
    };

    this.ObservableTest.prototype.testGetValue = function(queue) {
        expectAsserts(3);
        queuedRequire(queue, ["antie/declui/observable","antie/class"], function(Observable, Class) {
            var o = new Observable( 101 );

            var no = 202;

            assertEquals( 101, Observable.getValue( o ) );
            assertEquals( 202, Observable.getValue( no ) );
            assertEquals( undefined, Observable.getValue( undefined ) );
        });
    };

    this.ObservableTest.prototype.testSubscribeWithContextAndCallbackNotifiesWithContextAndObservable = function(queue) {
        expectAsserts(3);
        queuedRequire(queue, ["antie/declui/observable","antie/class"], function(Observable, Class) {
            var o = new Observable();

            var notifiedContext = null;
            var notifiedObservable = null;

            var cb0 = function( context, observable ){
                notifiedContext = context;
                notifiedObservable = observable;
            }
            var cx0 = { x:1,y:2};

            o.subscribe( cx0, cb0 );
            o( 100 );

            assertEquals( cx0, notifiedContext );
            assertEquals( o, notifiedObservable );
            assertEquals( 100, notifiedObservable() );
        });
    };

    this.ObservableTest.prototype.testSubscribeNotifyNotSentIfValueNoChanged = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/observable","antie/class"], function(Observable, Class) {
            var o = new Observable( 100 );

            var notifiedContext = null;
            var notifiedValue = null;
            var notifiedObservable;

            var cb0 = function( context, observable ){
                notifiedObservable = observable
                notifiedContext = context;
                notifiedValue = observable();
            }
            var cx0 = { x:1,y:2};

            o.subscribe( cx0, cb0 );
            o( 100 );

            assertEquals( null, notifiedContext );
        });
    };

    this.ObservableTest.prototype.testAccessNotifyOnAccess = function(queue) {
        queuedRequire(queue, ["antie/declui/observable", "antie/declui/pubsub", "antie/class"], function(Observable, PubSub, Class) {
            var o = new Observable( 100 );
            var notified;

            var a = 0;
            function accessNotifyFN( observable ){
                notified = observable;
                a++;
            }

            PubSub.startAccessListening( accessNotifyFN );
            assertEquals( 100, o() );
            PubSub.stopAccessListening();
            assertEquals( 100, o() );
            assertEquals( 1, a );
            assertEquals( o, notified );
        });
    };

    this.ObservableTest.prototype.testNoAccessNotifyOnWrite = function(queue) {
        queuedRequire(queue, ["antie/declui/observable", "antie/declui/pubsub", "antie/class"], function(Observable, PubSub, Class) {
            var o = new Observable( 100 );
            var notified;

            var a = 0;
            function accessNotifyFN( observable ){
                notified = observable;
                a++;
            }

            PubSub.startAccessListening( accessNotifyFN );
            o( 101 );
            PubSub.stopAccessListening();
            assertEquals( 101, o() );
            assertEquals( 0, a );
        });
    };



})();
