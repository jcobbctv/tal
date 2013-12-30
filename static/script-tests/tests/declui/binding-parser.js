(function() {
    this.BindingParserTest = AsyncTestCase("DU.BindingParser");

    this.BindingParserTest.prototype.setUp = function() {
    };

    this.BindingParserTest.prototype.tearDown = function() {
    };


    this.BindingParserTest.prototype.testSingle = function(queue) {
        expectAsserts(1);
    queuedRequire(queue, ["antie/declui/binding-parser","antie/declui/observable"], function(BindingParser, Observable) {
            var model = {
                mv : new Observable( 101 )
            }

            var binding = "binding0 : mv";
            var expected = { binding0 : model.mv };

            var br = BindingParser.bindingToObject( model, binding );

            assertEquals( expected, br );
        });
    };

    this.BindingParserTest.prototype.testMultiple = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/binding-parser","antie/declui/observable"], function(BindingParser, Observable) {
            var model = {
                mv0 : new Observable( 101 ),
                mv1 : new Observable( 202 ),
                mv2 : new Observable( 303 )
            }

            var binding = "binding0 : mv0, binding1 : mv1, binding2 : mv2";
            var expected = { binding0 : model.mv0, binding1 : model.mv1, binding2 : model.mv2 };

            var br = BindingParser.bindingToObject( model, binding );

            assertEquals( expected, br );
        });
    };

    this.BindingParserTest.prototype.testBindingToNonObservable = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/binding-parser","antie/declui/observable"], function(BindingParser, Observable) {
            var model = {
                mv0 : "one",
                mv1 : "two",
                mv2 : "three"
            }

            var binding = "binding0 : mv0, binding1 : mv1, binding2 : mv2";
            var expected = { binding0 : model.mv0, binding1 : model.mv1, binding2 : model.mv2 };

            var br = BindingParser.bindingToObject( model, binding );

            assertEquals( expected, br );
        });
    };

    this.BindingParserTest.prototype.testBindingWithLiteral = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/binding-parser","antie/declui/observable"], function(BindingParser, Observable) {
            var model = {
                mv0 : "one",
                mv1 : "two",
                mv2 : "three"
            }

            var binding = "binding0 : 'one', binding1 : 'two', binding2 : 'three'";
            var expected = { binding0 : model.mv0, binding1 : model.mv1, binding2 : model.mv2 };

            var br = BindingParser.bindingToObject( model, binding );

            assertEquals( expected, br );
        });
    };

    this.BindingParserTest.prototype.testBindingError = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/binding-parser","antie/declui/observable"], function(BindingParser, Observable) {
            var model = {
                mv : new Observable( 101 )
            }

            var binding = "binding0 : mb";
            var expected = { binding0 : model.mv };
            var bindingObject;

            try{
                bindingObject = BindingParser.bindingToObject( model, binding );
            }
            catch( x ){
                assertTrue( x instanceof BindingParser.BindingParserException );
            }

        });
    };

    this.BindingParserTest.prototype.testBindingWith = function(queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/declui/binding-parser","antie/declui/observable"], function(BindingParser, Observable) {
            var model = {
                mv0 : new Observable( 101 )
            };

            var withObject = {
                with0 : "foo",
                with1 : "bar"
            };

            var binding = "binding0 : with0, binding1 : with1, binding2 : mv0";
            var expected = { error: BindingParser.ERROR_NONE, bindingObject : { binding0 : withObject.with0, binding1 : withObject.with1, binding2 : model.mv0 } };

            var bindingObject = BindingParser.bindingToObject( withObject, model, binding );

            assertEquals( { binding0 : withObject.with0, binding1 : withObject.with1, binding2 : model.mv0 }, bindingObject );
        });
    };
})();
