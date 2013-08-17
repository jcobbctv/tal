require.def('antie/declui/typebinding',
    [
        "antie/class",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/verticallist",
    ],
    function(Class, Label, Button, VerticalList ) {

        var rootWidget  = null;
        var TypeBinding = {};

        TypeBinding.setRootWidget = function( widget ){
            rootWidget = widget;
        };

        TypeBinding.initBinding = function(){
            ko.bindingHandlers.taltype = {
                init : function( elem, valueAccessor ){
                    switch( valueAccessor() ){
                        case "label":
                            if( elem.id ){
                                elem.talWidget = new Label( elem.id, elem.innerText );
                            }else{
                                elem.talWidget = new Label( elem.innerText );
                            }
                            break;

                        case "button":
                            elem.talWidget = new Button( elem.id );
                            if( elem.innerText ){
                                var talLabel = new Label( elem.innerText );
                                elem.talWidget.appendChildWidget( talLabel );
                            }
                            break;

                        case "verticallist":
                            elem.talWidget = new VerticalList( elem.id );
                            break;
                    }

                    if( elem.parentElement && elem.parentElement.talWidget ){
                        elem.parentElement.talWidget.appendChildWidget( elem.talWidget );
                    }else{
                        rootWidget.appendChildWidget( elem.talWidget );
                    }
                }
            };
        };
        return TypeBinding;
    });