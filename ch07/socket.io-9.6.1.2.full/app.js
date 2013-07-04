var express = require('express'),
    http    = require( 'http' ),
    app     = express(),
    server  = http.createServer( app ),
    io      = require( 'socket.io' ).listen( server ),
    fs      = require('fs'), 
    root    = __dirname + '/public', 
    path    = require('path')
;

app.configure( function () {
  app.use( function ( req, res, next ) {  
    if (req.url.indexOf( '/js/' ) >= 0 || req.url.indexOf( '/css/' ) >= 0 ) {
      setWatch( req.url );
    }
    next();
  });
  app.use( express.static( __dirname + '/' ) );
});

var watchHash = {};  

function setWatch ( file ) {
  console.log( 'setWatch called on' + file );
  var socket = 'html';

  if ( !watchHash[ file ] ) {

    if ( file.indexOf( '/js/' ) >= 0 ) { 
      socket = 'script';
    } else if ( file.indexOf( '/css/' ) >= 0 ) { 
      socket = 'stylesheet';
    }
    console.log( 'setting watch on ' + file.slice(1) );
    fs.watchFile( file.slice(1), function ( current, previous ) { 
      console.log( 'file accessed' );
      if ( current.mtime !== previous.mtime ) {  
      console.log( 'file changed' );
        io.sockets.emit( socket, file );
      }

    });

    watchHash[ file ] = true;
  }
}

app.listen( 3000 );
console.log( 'Server running at http://127.0.0.1:3000/' );
