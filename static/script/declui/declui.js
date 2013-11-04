require.def('antie/declui/declui',
    [
        'antie/application',
        'antie/declui/uibuilder',
        "antie/declui/widget-factory"
    ],
    function (Application, UIBuilder, WidgetFactory ) {
        var DeclUI = {};
        var dataModelConstants = {};
        var processors = {};

        function addProcessor( name, processor ){
            processors[ name ] = processor;
        }

        DeclUI.processDOM = function( dom ){
        }


        DeclUI.createDomFromHTML = function(markup) {
            var device = Application.getCurrentApplication().getDevice();
            var element = device._createElement("div");
            element.innerHTML = markup;
            return element;
        }

        DeclUI.createDomFromXML = function(markup) {
            var domParser = new DOMParser();
            var doc       = domParser.parseFromString( markup, "application/xml" );
            return doc;
        }

        DeclUI.buildUI = function( rootWidget, dataModel, markup) {
            var dom = createDom(markup);
            UIBuilder.createUIFromXML( dataModelConstants, dataModel, dom );
        }

        return DeclUI;
    }
);
