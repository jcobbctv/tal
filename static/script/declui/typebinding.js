require.def('antie/declui/typebinding',
    [
        "antie/class",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/verticallist",
        "antie/widgets/horizontallist",
        "antie/widgets/horizontalcarousel",
        "antie/widgets/image"
    ],
    function(Class, Label, Button, VerticalList, HorizontalList, HorizontalCarousel, Image ) {

        var rootWidget  = null;
        var TypeBinding = {};

        TypeBinding.setRootWidget = function( widget ){
            rootWidget = widget;
        };

        TypeBinding.initBinding = function(){
            ko.bindingHandlers.type = {
                init : function( elem, valueAccessor, allBindingsAccessor ){

                    var type = valueAccessor();

                    var va = valueAccessor();
                    var ab = allBindingsAccessor();
                   // var bc = bindingContext;

                    switch( type ){
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

                        case "image":
                            var src = elem.getAttribute( "src" );
                            var width = elem.getAttribute( "width" );
                            var height = elem.getAttribute( "height" );
                            elem.talWidget = new Image( elem.id, src, { width : width, height: height } );
                            break;

                        case "horizontalcarousel":
                            elem.talWidget = new HorizontalCarousel( elem.id );
                            //elem.talWidget.setWrapMode( HorizontalCarousel.WRAP_MODE_NONE );
                            break;
                    }

                    //if there is a foreach binding then unwrap to get update
                    if( allBindingsAccessor().foreach ){
                        ko.unwrap( allBindingsAccessor().foreach );
                        console.log( "foreach found in init" );
                    }

                    //pass on class properties
                    if( elem.talWidget && elem.className ){
                        var classArray = elem.className.split(" ");
                        for( var i = 0; i < classArray.length; i++ ){
                            elem.talWidget.addClass( classArray[ i ] );
                        }
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