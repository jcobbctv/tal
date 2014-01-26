(function() {
    this.ImageBindingTest = AsyncTestCase("DU.ImageBindingTest");

    this.ImageBindingTest.prototype.setUp = function() {
    };

    this.ImageBindingTest.prototype.tearDown = function() {
    };

    this.ImageBindingTest.prototype.testImageBindingHasCorrectName = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/imagebinding"], function(ImageBinding) {
            assertEquals( "image", ImageBinding.name );
        });
    };

    this.ImageBindingTest.prototype.testImageBindingHasNoInitFunction = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/imagebinding"], function(ImageBinding) {
            assertTrue( ImageBinding.init === undefined );
        });
    };

    this.ImageBindingTest.prototype.testImageBindingUpdateCallSetSrcOnWidgetWithSetSrc= function(queue) {
        expectAsserts(1);
        queuedApplicationInit( queue, "lib/mockapplication", ["antie/declui/imagebinding", "antie/widgets/image", "antie/declui/observable" ],
            function( App, ImageBinding, Image, Observable ) {

                var image = {
                    text : "",
                    setSrc : function( text ){ this.text = text; },
                    getSrc : function(){ return this.text; }
                };

                var binderParams = {};

                var context = {
                    widget : image
                };

                binderParams.context = context;
                var observable = new Observable( "SetFromObservable" );
                binderParams.modelAccessor = function(){ return { src : 1 }; };

                ImageBinding.update( binderParams, observable );

                assertEquals( "SetFromObservable", image.getSrc() );
            });
    };
})();
