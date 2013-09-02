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
	this.ObservableArrayTest = AsyncTestCase("ObservableArray");

	this.ObservableArrayTest.prototype.setUp = function() {
	};

	this.ObservableArrayTest.prototype.tearDown = function() {
	};


    this.ObservableArrayTest.prototype.testConstruction = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/observable-array","antie/class"], function(ObservableArray, Class) {
            var o = new ObservableArray( [ 303 ] );
            assertEquals( [ 303 ], o() );
        });
    };

    this.ObservableArrayTest.prototype.testConstructionWithNonArrayValueConvertedToArray = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/observable-array","antie/class"], function(ObservableArray, Class) {
            var o = new ObservableArray( 303 );
            assertEquals( [ 303 ], o() );
        });
    };

    this.ObservableArrayTest.prototype.testValueSetIsValueReturned = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/observable-array","antie/class"], function(ObservableArray, Class) {
            var o = new ObservableArray();
            o( [ "badooosh" ] );
            assertEquals( [ "badooosh" ], o() );
        });
    };

    this.ObservableArrayTest.prototype.testNonArrayValueIsConvertedToArray = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/observable-array","antie/class"], function(ObservableArray, Class) {
            var o = new ObservableArray();
            o( "badooosh" );
            assertEquals( [ "badooosh" ], o() );
        });
    };



})();
