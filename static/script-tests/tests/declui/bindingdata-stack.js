(function() {
    this.BindingContextTest = AsyncTestCase("DU.BindingDataStack");

    this.BindingContextTest.prototype.setUp = function() {
    };

    this.BindingContextTest.prototype.tearDown = function() {
    };

    this.BindingContextTest.prototype.testBindingDataStackConstructFromAccessor = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/bindingdata-stack"], function(BindingDataStack) {

            var bc = new BindingDataStack( { a : 101 } );

            assertEquals( 101, bc.getModel().a );
        });
    };

    this.BindingContextTest.prototype.testBindingDataStackConstructFromAccessorArray = function(queue) {
        expectAsserts(4);
        queuedRequire(queue, ["antie/declui/bindingdata-stack"], function(BindingDataStack) {

            var a = { a : 101 };
            var b = { b : 202 };
            var c = { c : 303 };

            var bc = new BindingDataStack( [ a, b, c ] );

            assertEquals( 101, bc.getModel().a );
            assertEquals( a, bc.getStack()[ 0 ] );
            assertEquals( b, bc.getStack()[ 1 ] );
            assertEquals( c, bc.getStack()[ 2 ] );
        });
    };

    this.BindingContextTest.prototype.testAddContext = function(queue) {
        expectAsserts(4);
        queuedRequire(queue, ["antie/declui/bindingdata-stack"], function(BindingDataStack) {

            var a = { a : 101 };
            var b = { b : 202 };
            var c = { c : 303 };

            var bc = new BindingDataStack( [ b, c ] );
            var nc = bc.extend( a );

            assertEquals( 101, nc.getModel().a );
            assertEquals( a, nc.getStack()[ 0 ] );
            assertEquals( b, nc.getStack()[ 1 ] );
            assertEquals( c, nc.getStack()[ 2 ] );
        });
    };

    this.BindingContextTest.prototype.testGetParent = function(queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/declui/bindingdata-stack"], function(BindingDataStack) {

            var a = { a : 101 };
            var b = { b : 202 };
            var c = { c : 303 };

            var bc = new BindingDataStack( [ b, c ] );
            var nc = bc.extend( a );

            assertEquals( 101, nc.getModel().a );
            assertEquals( b, nc.getParentModel() );
        });
    };


})();
