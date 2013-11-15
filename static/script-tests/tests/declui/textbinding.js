(function() {
    this.TypeBindingTest = AsyncTestCase("TextBindingTest");

    this.TypeBindingTest.prototype.setUp = function() {
    };

    this.TypeBindingTest.prototype.tearDown = function() {
    };

    this.TypeBindingTest.prototype.testTextBindingHasNoInitFunction = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/textbinding"], function(TextBinding) {

            assertTrue( TextBinding.init === undefined );

        });
    };

    this.TypeBindingTest.prototype.testTextBindingUpdateCallSetTextOnLabel = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/textbinding"], function(TextBinding) {

            var context = {
                widget :

            };


        });
    };

})();
