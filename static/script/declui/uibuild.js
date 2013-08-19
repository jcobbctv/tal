
require.def('antie/declui/uibuild',
    [
        "antie/class",
        "antie/application",
        "antie/devices/device",
        "antie/declui/typebinding",
        "antie/declui/textbinding",
        "antie/declui/selectbinding"
    ],
    function(Class, Application, Device, TypeBinding, TextBinding, SelectBinding ) {

        var application = Application.getCurrentApplication();
        var device      = application.getDevice();

        TypeBinding.initBinding();
        TextBinding.initBinding();
        SelectBinding.initBinding();

        var UIBuild = {};

        UIBuild.createUI = function( rootWidget, dataModel, layout ){
            var layoutDom = device.createContainer();
            layoutDom.style.display = "none";
            layoutDom.innerHTML = layout;

            document.body.appendChild( layoutDom );

            TypeBinding.setRootWidget( rootWidget );
            ko.applyBindings( dataModel, layoutDom );

            return layoutDom;
        }

        return UIBuild;
    }
);