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
    this.PubSubTest = AsyncTestCase("DU.PubSub");

    this.PubSubTest.prototype.setUp = function() {
    };

    this.PubSubTest.prototype.tearDown = function() {
    };

    this.PubSubTest.prototype.testSubscribeWithCallbackAndContext = function(queue) {
        expectAsserts(4);
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {
            var o = new PubSub();

            var cb0 = function( value ){}
            var cx0 = { x:1,y:2};

            var cb1 = function( value ){}
            var cx1 = { x:10,y:20};

            o.subscribe( cx0, cb0 );
            o.subscribe( cx1, cb1 );

            assertEquals( cb0, o._subscribers[ 0 ].callback );
            assertEquals( cx0, o._subscribers[ 0 ].context );

            assertEquals( cb1, o._subscribers[ 1 ].callback );
            assertEquals( cx1, o._subscribers[ 1 ].context );
        });
    };

    this.PubSubTest.prototype.testSubscribeWithCallbackWithoutContext = function(queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {
            var o = new PubSub();

            var cb0 = function( value ){}
            var cb1 = function( value ){}

            o.subscribe( cb0 );
            o.subscribe( cb1 );

            assertEquals( cb0, o._subscribers[ 0 ].callback );
            assertEquals( cb1, o._subscribers[ 1 ].callback );
        });
    };

    this.PubSubTest.prototype.testSubscribeWithContextAndCallbackNotifiesWithContextAndValue = function(queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {
            var o = new PubSub();

            var notifiedContext = null;
            var notifiedValue = null;

            var cb0 = function( context, value ){
                notifiedContext = context;
                notifiedValue = value;
            }
            var cx0 = { x:1,y:2};

            o.subscribe( cx0, cb0 );
            o.notifySubscribers( 100 );

            assertEquals( cx0, notifiedContext );
            assertEquals( 100, notifiedValue );
        });
    };

    this.PubSubTest.prototype.testSubscribeWithoutContextButCallbackNotifiesWithUndefinedContextButCorrectValue = function(queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {
            var o = new PubSub();

            var notifiedContext = null;
            var notifiedValue = null;

            var cb0 = function( context, value ){
                notifiedContext = context;
                notifiedValue = value;
            }

            o.subscribe( cb0 );
            o.notifySubscribers( 100 );

            assertEquals( undefined, notifiedContext );
            assertEquals( 100, notifiedValue );
        });
    };

    this.PubSubTest.prototype.testSubscribeWithContextAndCallbackNotifiesCorrectlyWhenOnlyValueRequired = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {
            var o = new PubSub();

            var notifiedValue = null;

            var cb0 = function( value ){
                notifiedValue = value;
            }

            var cx0 = { x:1,y:2};

            o.subscribe( cx0, cb0 );
            o.notifySubscribers( 100 );

            assertEquals( 100, notifiedValue );
        });
    };

    this.PubSubTest.prototype.testCannotSubscribeSameFunctionAndContextTwice = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {
            var o = new PubSub();

            var cb0 = function( value ){}
            var cx0 = { x:1,y:2};

            o.subscribe( cx0, cb0 );
            o.subscribe( cx0, cb0 );

            assertEquals( 1, o._subscribers.length );
        });
    };

    this.PubSubTest.prototype.testUnsubscribe = function(queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {
            var o = new PubSub();

            var cb0 = function( value ){}
            var cx0 = { x:1,y:2};

            var cb1 = function( value ){}
            var cx1 = { x:10,y:20};

            o.subscribe( cx0, cb0 );
            o.subscribe( cx1, cb1 );

            o.unsubscribe( cx0, cb0 );

            assertEquals( cx1, o._subscribers[ 0 ].context );
            assertEquals( cb1, o._subscribers[ 0 ].callback );
        });
    };

    this.PubSubTest.prototype.testUnsubscribeWithoutContext = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {
            var o = new PubSub();

            var cb0 = function( value ){}
            var cb1 = function( value ){}

            o.subscribe( cb0 );
            o.subscribe( cb1 );

            o.unsubscribe( cb0 );

            assertEquals(  cb1, o._subscribers[ 0 ].callback )
        });
    };

    this.PubSubTest.prototype.testAccessNotify = function(queue) {
        queuedRequire(queue, ["antie/declui/pubsub","antie/class"], function(PubSub, Class) {

            var a = 0;
            function accessNotify( observable ){
                a++;
            }

            PubSub.startAccessListening( accessNotify );
            PubSub.accessNotify();
            assertEquals( a, 1 );
            PubSub.stopAccessListening();
            assertEquals( a, 1 );
        });
    };

})();
