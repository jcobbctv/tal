require.def( 'antie/declui/binding-parser',
    function() {
        var BindingParser = {};


        BindingParser.BindingParserException = function BindingParserException( message ){
            this.message = message;
        }

        BindingParser.ERROR_NONE        = 0;
        BindingParser.ERROR_PARSING     = 1;

        BindingParser.bindingToObject = function( dataModelConstants, dataModel, bindingText ){

            if( arguments.length === 2 ){
                bindingText = dataModel;
                dataModel = dataModelConstants;
                dataModelConstants = {};
            }

            var source =
                "var bindingObject;" +
                    "with(withObject){" +
                        "with(model){" +
                            "bindingObject = ({"  + bindingText + "})" +
                        "}" +
                    "}; " +
                "return bindingObject;";

            var bindingObject;
            try{
                var bindingFunc = new Function( "model", "withObject", source );
                bindingObject = bindingFunc( dataModel, dataModelConstants, bindingText );
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
