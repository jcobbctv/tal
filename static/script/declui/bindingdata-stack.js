require.def('antie/declui/bindingdata-stack',
    function() {

        var BindingDataStack = function( init ){
            var dataStack;

            if( init instanceof Array ){
                dataStack = init.slice( 0 );
            }else{
                dataStack = [ init ];
            }

            this.getCurrentModel = function(){
                return dataStack[ 0 ];
            };

            this.getStack = function(){
                return dataStack;
            };

            this.extend = function( model ){
                var nc = new BindingDataStack( dataStack );
                nc.getStack().unshift( model );
                return nc;
            };
        };

        return BindingDataStack;
    }
);
