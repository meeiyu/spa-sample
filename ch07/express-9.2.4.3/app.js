var express = require( 'express' ),
    app = express.createServer();

app.configure( function () {
  app.use( express.logger() );
  app.use( express.bodyDecoder() );
  app.use( express.methodOverride() );
});

app.get('/', function( req, res ) {
  res.send('Hello World');
});

app.listen( 3000 );
console.log( 'Server running at http://127.0.0.1:3000/' );
