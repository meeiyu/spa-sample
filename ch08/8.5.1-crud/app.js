/**
 * Module dependencies.
 */
var express = require( 'express' ),
    app     = module.exports = express.createServer(),
    routes  = require( './routes.js' )( app );

// Configuration
app.configure( function (  ) {
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( express.static( __dirname + '/public' ) );
  app.use( app.router );
});

app.configure( 'development', function () {
  app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) ); 
});

app.configure( 'production', function () {
  app.use( express.errorHandler() ); 
});

routes.set();

app.listen( 3000 );
//app.listen( 3000, '172.17.196.228');
console.log("Express server listening on port 3000");
