var express = require( 'express' ),
    app = express.createServer();

app.configure( function () {
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
});

app.configure( 'development', function () {
  app.use( express.logger() );
  app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) );
});

app.configure( 'production', function () {
  app.use( express.errorHandler() );
});

app.get( '/', function( req, res ){
  res.send( 'Hello World' );
});

app.listen( 3000 );
console.log( 'Server running at http://127.0.0.1:3000/' );
