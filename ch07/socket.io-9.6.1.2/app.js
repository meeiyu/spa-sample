var express = require('express'),
    app     = express.createServer(),
    io      = require( 'socket.io' ).listen( app ),
    fs      = require('fs');

app.configure( function () {
  app.use( function ( req, res, next ) {  
    req.on( 'static', function () { 
      var is_javascript_file = req.url.indexOf( '/js' ) > -1;

      if ( is_javascript_file ) {
        setWatch( req.url ); 
      }
      
    });
    next();
  });
  app.use( express.static( __dirname + '/' ) );
});

function setWatch ( file ) {
  var file_path = file.slice( 1 );

  fs.watchFile( file_path, function ( current, previous ) { 
    var is_modified = current.mtime + '' !== previous.mtime + '';

    if ( is_modified ) {  
      io.sockets.emit( 'script', file );
    }
  });
}

app.listen( 3000 );
console.log( 'Server running at http://127.0.0.1:3000/' );
