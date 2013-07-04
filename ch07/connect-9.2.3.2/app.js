var Connect = require( 'connect' );
Connect.createServer( 
  Connect.logger(),
  function ( req, res, next ) {
    res.writeHead( 200 )
    res.end( 'Hello World\n' );
  }
).listen( 3000 );
console.log( 'Server running at http://127.0.0.1:3000/' );