(function() {
    this.DeclUITest = AsyncTestCase("DeclUI");

    this.DeclUITest.prototype.setUp = function() {
    };

    this.DeclUITest.prototype.tearDown = function() {
    };


    this.DeclUITest.prototype.testSingle = function(queue) {
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
})();
