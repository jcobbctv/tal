require.def('antie/declui/typebinding',
    [
        "antie/class",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/verticallist",
        "antie/widgets/horizontallist"
    ],
    function(Class, Label, Button, VerticalList, HorizontalList ) {

        var rootWidget  = null;
        var TypeBinding = {};

        TypeBinding.setRootWidget = function( widget ){
            rootWidget = widget;
        };

        TypeBinding.initBinding = function(){
            ko.bindingHandlers.type = {
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

                        case "horizontallist":
                            elem.talWidget = new HorizontalList( elem.id );
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