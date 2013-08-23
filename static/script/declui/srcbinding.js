require.def('antie/declui/srcbinding',
    [
        "antie/widgets/image",
    ],
    function( Image ) {

        var SrcBinding = {};

        function bindSrc( elem, valueUnwrapped ){
            if( elem.talWidget ){
                if( elem.talWidget instanceof Image ){
                    elem.talWidget.setSrc( valueUnwrapped );
                }
            }
        }

        SrcBinding.initBinding = function(){
            ko.bindingHandlers.src = {
                init : function( elem, valueAccessor ){
                    var valueUnwrapped = ko.unwrap( valueAccessor() );
                    bindSrc( elem, valueUnwrapped );
                },
                update: function( elem, valueAccessor ){
                    var valueUnwrapped = ko.unwrap( valueAccessor() );
                    bindSrc( elem, valueUnwrapped );
                }
            };
        }
        return SrcBinding;
    });