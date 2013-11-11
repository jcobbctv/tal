(function() {
    this.WidgetFactoryTest = AsyncTestCase("WidgetFactory");

    this.WidgetFactoryTest.prototype.setUp = function() {
    };

    this.WidgetFactoryTest.prototype.tearDown = function() {
    };

    this.WidgetFactoryTest.prototype.testCreateButton = function(queue) {
        queuedRequire(queue, ["antie/application", "antie/declui/awidgetfactory"], function(App,WidgetFactory) {

        });
    };

    this.WidgetFactoryTest.prototype.testCreateLabel = function(queue) {
        queuedRequire(queue, ["antie/application","antie/declui/awidgetfactory"], function(App,WidgetFactory) {

        });
    };
})();
