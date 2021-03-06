require.def('antie/declui/declui',
    [
        'antie/application',
        'antie/declui/uibuilder',
        'antie/declui/widgetfactory',
        'antie/declui/textbinding',
        'antie/declui/foreachbinding',
        'antie/declui/selectbinding',
        'antie/declui/imagebinding',
        'antie/declui/eventbinding',
        'antie/declui/disabledbinding'
    ],
    function (Application, UIBuilder, WidgetFactory, TextBinding, ForEachBinding, SelectBinding, ImageBinding, EventBinding, DisabledBinding ) {
        var DeclUI = {};

        function loadBinders(){
            var binders = {};
            binders[ TextBinding.name ]    = TextBinding;
            binders[ ForEachBinding.name ] = ForEachBinding;
            binders[ SelectBinding.name ] = SelectBinding;
            binders[ ImageBinding.name ] = ImageBinding;
            binders[ EventBinding.name ] = EventBinding;
            binders[ DisabledBinding.name ] = DisabledBinding;
            return binders;
        }

        DeclUI.createDomFromXML = function(markup) {
            var domParser = new DOMParser();
            var doc       = domParser.parseFromString( markup, "application/xml" );
            return doc;
        }

        DeclUI.buildUI = function( container, dataModel, markup) {
           var dom = this.createDomFromXML( markup );

           var context = UIBuilder.buildUIFromXMLDom(
               { model : dataModel,
                 docElement:dom.documentElement,
                 binders: this.binders,
                 widgetFactory: WidgetFactory
               }
           );

            var i;
            for( i = 0; i < context.children.length; i++ ){
                container.appendChildWidget( context.children[ i ].widget );
            }
        }

        DeclUI.binders = loadBinders();

        return DeclUI;
    }
);
