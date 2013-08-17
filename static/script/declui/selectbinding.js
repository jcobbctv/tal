require.def('antie/declui/selectbinding',[],
    function() {

        var SelectBinding = {};

        function selectBinding( elem, valueAccessor ){

            function selectEventListener( evt ){
                valueAccessor()( evt );
            }

            elem.talWidget.removeEventListener( "select", selectEventListener );
            elem.talWidget.addEventListener( "select", selectEventListener );
        }

        SelectBinding.initBinding = function(){
            ko.bindingHandlers.select = {
                init: function( elem, valueAccessor ){
                   selectBinding( elem, valueAccessor );
                },

                update: function( elem, valueAccessor ){
                    selectBinding( elem, valueAccessor );
                }
            };
        };

        return SelectBinding;
    });