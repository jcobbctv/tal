require.def('antie/declui/widgetfactory', [ 'antie/widgets/button', 'antie/widgets/label', "antie/widgets/image", "antie/widgets/horizontallist", "antie/widgets/verticallist", "antie/widgets/horizontalcarousel" ],
    function (Button,Label,Image,HorizontalList,VerticalList,HorizontalCarousel) {

        var WidgetFactory = {
            handlers : {},

            registerHandler : function( nodeType, handler ){
                if( this.handlers[ nodeType ] !== undefined ){
                    throw new this.HandlerAlreadyRegistered( nodeType + " already registered" );
                }
                this.handlers[ nodeType ] = handler;
            },

            createWidget : function( context ){
                var widget;

                if( context.widget ){
                    if( context.parentContext.widget ){
                        context.parentContext.widget.removeChildWidget( context.widget );
                    }
                    context.widget = null;
                }

                if( this.handlers[ context.nodeType ] ){
                    widget = this.handlers[ context.nodeType ]( context );
                }else{
                    throw new this.HandlerNotRegistered( "no handler registered for " + context.nodeType );
                }

                if( context.class ){
                    var classes = context.class.split( " " );
                    var i;

                    for( i = 0; i < classes.length; i++ ){
                        widget.addClass( classes[ i ] );
                    }
                }

                if( context.parentContext && context.parentContext.widget ){
                    context.parentContext.widget.appendChildWidget( widget );
                }

                return widget;
            },

            updateWidget : function( context ){
                context.widget.removeChildWidgets();
            }
        };

        WidgetFactory.registerHandler( "button", function( context ){
            var widget = new Button( context.id );

            if( context.text ){
                var label = new Label( context.text );
                widget.appendChildWidget( label );
            }
            return widget;
        } );

        WidgetFactory.registerHandler( "view", function( context ){
            return null;
        } );

        WidgetFactory.registerHandler( "label", function( context ){
            return new Label( context.id, context.text );
        } );

        WidgetFactory.registerHandler( "image", function( context ){
            var size = parseInt( context.size, 10 );
            var widthHeight = { width : size, height : size };

            return new Image( context.id, context.src, widthHeight );
        } );

        WidgetFactory.registerHandler( "hlist", function( context ){
            return new HorizontalList( context.id );
        } );

        WidgetFactory.registerHandler( "vlist", function( context ){
            return new VerticalList( context.id );
        } );

        WidgetFactory.registerHandler( "hcarousel", function( context ){
            return new HorizontalCarousel( context.id );
        } );

        WidgetFactory.HandlerAlreadyRegistered = function HandlerAlreadyRegistered(message) {
            this.message = message;
        }

        WidgetFactory.HandlerNotRegistered = function HandlerNotRegistered(message) {
            this.message = message;
        }

        return WidgetFactory;
    });