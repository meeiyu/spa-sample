/**
 * Module dependencies.
 */
var express = require( 'express' ),
    app     = module.exports = express.createServer(),
    routes  = require( './routes.js' )( app ),
    io      = require( 'socket.io' ).listen( app ),
    fs      = require( 'fs' );

// Configuration
app.configure( function (  ) {
  
  app.use( function ( req, res, next ) {  
    req.on( 'static', function () { 
      var is_javascript_file = req.url.indexOf( '/js' ) > -1;

      if ( is_javascript_file ) {
        setWatch( req.url ); 
      }
    });
    next();
  });
  
  app.use( app.router );
  app.use( express.static( __dirname + '/public' ) );
});

app.configure( 'development', function () {
  app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) ); 
});

app.configure( 'production', function () {
  app.use( express.errorHandler() ); 
});


function setWatch ( file ) {
  var file_path = file.slice( 1 );
  console.log( 'watch set for: ' + file_path );
  fs.unwatchFile( 'public/' + file_path );
  fs.watchFile( 'public/' + file_path, function ( current, previous ) { 
    var is_modified = current.mtime + '' !== previous.mtime + '';
    console.log( 'watch fires' );
    if ( is_modified ) {  
      io.sockets.emit( 'script', file );
    }
  });
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
