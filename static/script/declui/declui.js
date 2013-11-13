require.def('antie/declui/declui',
    [
        'antie/application',
        'antie/declui/uibuilder'
    ],
    function (Application, UIBuilder ) {
        var DeclUI = {};
        var bindings = {};

        DeclUI.createDomFromXML = function(markup) {
            var domParser = new DOMParser();
            var doc       = domParser.parseFromString( markup, "application/xml" );
            return doc;
        }

        DeclUI.buildUI = function( rootWidget, dataModel, markup) {
//            var dom = createDom(markup);
//            UIBuilder.createUIFromXML( dataModelConstants, dataModel, dom );
        }

        return DeclUI;
    }
);
