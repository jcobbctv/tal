
require.def('antie/declui/uibuild',
    [
        "antie/class",
        "antie/application",
        "antie/devices/device",
        "antie/declui/typebinding",
        "antie/declui/textbinding",
        "antie/declui/selectbinding",
        "antie/declui/srcbinding",
    ],
    function(Class, Application, Device, TypeBinding, TextBinding, SelectBinding, SrcBinding, ForeachBinding ) {

        var application = Application.getCurrentApplication();
        var device      = application.getDevice();

        TypeBinding.initBinding();
        TextBinding.initBinding();
        SelectBinding.initBinding();
        SrcBinding.initBinding();

        var UIBuild = {};

        UIBuild.createUI = function( rootWidget, dataModel, layout ){
            var layoutDom = device.createContainer();
            layoutDom.style.display = "none";
            layoutDom.innerHTML = layout;

            dataModel._tr = function( elem, index, removed ){
                var talContainer = elem.parentElement.talWidget;
                var talWidget = talContainer.getChildWidgets()[ index ];
                talContainer.removeChildWidget( talWidget );
                elem.parentElement.removeChild( elem );
                console.log( elem );
            }

            document.body.appendChild( layoutDom );

            TypeBinding.setRootWidget( rootWidget );
            ko.applyBindings( dataModel, layoutDom );

            return layoutDom;
        }

        return UIBuild;
    }
);