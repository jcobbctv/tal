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
	this.ObservableTest = AsyncTestCase("DU.ComputedObservable");

	this.ObservableTest.prototype.setUp = function() {
	};

	this.ObservableTest.prototype.tearDown = function() {
	};

    this.ObservableTest.prototype.testConstruction = function(queue) {
        queuedRequire(queue, ["antie/declui/computed-observable", "antie/declui/observable", "antie/class"], function(ComputedObservable, Observable, Class) {
            var o = new ComputedObservable( function(){ return 303; } );
            assertEquals( 303, o() );
        });
    };

    this.ObservableTest.prototype.testComputedObservableRecomputes = function(queue) {
        queuedRequire(queue, ["antie/declui/computed-observable", "antie/declui/observable", "antie/class"], function(ComputedObservable, Observable, Class) {

            var a = new Observable( 101 );
            var b = new Observable( 202 );

            var o = new ComputedObservable( function(){
                return a() + b(); } );

            assertEquals( 303, o() );
        });
    };


    this.ObservableTest.prototype.testComputedObservableNotifiesIfDependedVariableChanges = function(queue) {
        queuedRequire(queue, ["antie/declui/computed-observable", "antie/declui/observable", "antie/class"], function(ComputedObservable, Observable, Class) {

            var a = new Observable( 101 );
            var b = new Observable( 202 );

            var o = new ComputedObservable( function(){
                return a() + b(); } );

            var notifiedObs;

            o.subscribe( function subFN( obs ){
                notifiedObs = obs;
            } );

            b( 303 );

            assertEquals( o, notifiedObs );
            assertEquals( 404, o() );
        });
    };

    this.ObservableTest.prototype.testComputedObservableNotifiesIfDependedVariableChangesArray = function(queue) {
        queuedRequire(queue, ["antie/declui/computed-observable", "antie/declui/observable", "antie/class"], function(ComputedObservable, Observable, Class) {

            var a = new Observable( 101 );
            var b = new Observable( [ 202 ] );

            var o = new ComputedObservable( function(){
                return a() + b()[ 0 ]; } );

            var notifiedObs;

            o.subscribe( function subFN( obs ){
                notifiedObs = obs;
            } );

            b( [ 303 ] );

            assertEquals( o, notifiedObs );
            assertEquals( 404, o() );
        });
    };


})();
