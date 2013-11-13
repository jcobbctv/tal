(function() {
    this.DeclUITest = AsyncTestCase("DeclUI");

    this.DeclUITest.prototype.testCreateDomFromXML = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/declui"], function(DeclUI) {

            var xmlMarkup =
                '<view>' +
                    '<button id="actionButton" class="poshButton">' +
                        '<image id="buttonImage" class="poshImage"/>' +
                    '</button>' +
                '</view>';


            var dom = DeclUI.createDomFromXML();
        });
    };


    this.DeclUITest.prototype.testAddBinding = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/declui"], function(DeclUI) {

            var TextBinding = { init : function(){}, update : function(){} };

            DeclUI.addBinding( "text", TextBinding );

            assertEquals( DeclUI.binders, TextBinding );
        });
    };

})();
