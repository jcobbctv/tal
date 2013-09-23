(function() {
    this.ObservableTest = AsyncTestCase("BindingParser");

    this.ObservableTest.prototype.setUp = function() {
    };

    this.ObservableTest.prototype.tearDown = function() {
    };


    this.ObservableTest.prototype.testConstruction = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/binding-parser","antie/class"], function(BindingParser, Class) {




        });
    };


})();
