var express = require( 'express' ),
    app = express.createServer();

app.use( express.logger() );

app.get( '/', function( req, res ) {
  res.send( 'Hello World' );
});

app.listen( 3000 );
console.log( 'Server running at http://127.0.0.1:3000/' ); 