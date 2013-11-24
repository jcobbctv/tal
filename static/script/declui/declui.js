require.def('antie/declui/declui',
    [
        'antie/application',
        'antie/declui/uibuilder',
        'antie/declui/widgetfactory'
    ],
    function (Application, UIBuilder ) {
        var DeclUI = {};
        var binders = {};

        DeclUI.createDomFromXML = function(markup) {
            var domParser = new DOMParser();
            var doc       = domParser.parseFromString( markup, "application/xml" );
            return doc;
        }

        DeclUI.buildUI = function( containerWidget, dataModel, markup) {
            var dom = this.createDomFromXML( markup );

            UIBuilder.buildUIFromXMLDom( { model : dataModel, viewElement:dom.documentElement, } );



//            var dom = createDom(markup);
//            UIBuilder.createUIFromXML( dataModelConstants, dataModel, dom );
        }

        return DeclUI;
    }
);
