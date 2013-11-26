(function() {
    this.DeclUITest = AsyncTestCase("DU.DeclUI");

    this.DeclUITest.prototype.testCreateDomFromXML = function(queue) {
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

    this.DeclUITest.prototype.testBindersAreLoaded = function(queue) {
        queuedApplicationInit( queue, "lib/mockapplication", [ "antie/declui/declui", "antie/declui/textbinding", "antie/declui/foreachbinding"],
            function( application,DeclUI,TextBinding,ForEachBinding) {

                assertEquals( DeclUI.binders[ TextBinding.name ], TextBinding );
                assertEquals( DeclUI.binders[ ForEachBinding.name ], ForEachBinding );
            });
    };

})();
