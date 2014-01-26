require.def( 'antie/declui/binding-parser',
    function() {
        var BindingParser = {};


        BindingParser.BindingParserException = function BindingParserException( message ){
            this.message = message;
        }

        BindingParser.ERROR_NONE        = 0;
        BindingParser.ERROR_PARSING     = 1;

        BindingParser.bindingToObject = function( parentModel, dataModel, bindingText ){

            if( arguments.length === 2 ){
                bindingText = dataModel;
                dataModel = parentModel;
                parentModel = undefined;
            }

            var source =
                "var parentWrapper = { $parent : parentModel };" +
                "var bindingObject;" +
                "with(parentWrapper){" +
                    "with(model){" +
                        "bindingObject = ({"  + bindingText + "})" +
                    "}};" +
                "return bindingObject;";

            var bindingObject;
            try{
                var bindingFunc = new Function( "parentModel", "model", source );
                bindingObject = bindingFunc( parentModel, dataModel, bindingText );
            }
            catch( x ){
                var bx = new BindingParser.BindingParserException(x.message);
                throw bx;
            }
            return bindingObject;
        }

        return BindingParser;
    }
);
