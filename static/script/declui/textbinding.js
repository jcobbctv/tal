require.def('antie/declui/textbinding',
    [
        "antie/widgets/label",
    ],
    function( Label ) {

        var TextBinding = {};

        function bindText( elem, valueUnwrapped ){
            if( elem.talWidget ){
                if( elem.talWidget instanceof Label ){
                    elem.talWidget.setText( valueUnwrapped );
                }else{
                    var i;
                    var childWidgets = elem.talWidget.getChildWidgets();

                    var textSet = false;
                    if( childWidgets ){
                        for( i = 0; i < childWidgets.length; i++ ){
                            if( childWidgets[ i ] instanceof Label ){
                                childWidgets[ i ].setText( valueUnwrapped );
                                textSet = true;
                            }
                        }
                    }
                    if( !textSet ){
                        elem.talWidget.appendChildWidget( new Label( valueUnwrapped ) )
                    }
                }
            }
        }

        TextBinding.initBinding = function(){
            ko.bindingHandlers.text = {
                init : function( elem, valueAccessor ){
                    var valueUnwrapped = ko.unwrap( valueAccessor() );
                    bindText( elem, valueUnwrapped );
                },
                update: function( elem, valueAccessor ){
                    var valueUnwrapped = ko.unwrap( valueAccessor() );
                    bindText( elem, valueUnwrapped );
                }
            };
        }
        return TextBinding;
    });