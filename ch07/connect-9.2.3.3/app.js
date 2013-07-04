var Connect = require( 'connect' ),
  app = Connect.createServer( 
    Connect.logger(),
    function ( req, res, next ) {
      res.writeHead( 200 )
      res.end( 'Hello World\n' );
    }
  );
app.listen( 3000 );
console.log( 'Server running at http://127.0.0.1:3000/' );
