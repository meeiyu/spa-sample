/**
 * Module dependencies.
 */
var express = require( 'express' ),
    app     = module.exports = express.createServer();

// Configuration
app.configure( function (  ) {
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( app.router );
  app.use( express.static( __dirname + '/public' ) );
});

app.configure( 'development', function () {
  app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) ); 
});

app.configure( 'production', function () {
  app.use( express.errorHandler() ); 
});

// Routes
app.all( '/:object/*?', function ( req, res, next ) {
  res.contentType( 'json' );
  next();
});

app.get( '/:object/list', function ( req, res ) {
  res.send( { title: objectify( req.params.object ) + ' list' } );
});

app.post( '/:object/create', function ( req, res ) {
  res.send( { title: objectify( req.params.object )  + ' created' } );
});

app.get( '/:object/read/:id([0-9]+)', function ( req, res ) {
  res.send( { title: objectify( req.params.object ) + ' with id ' + req.params.id + ' found' } );
});

app.post( '/:object/update/:id([0-9]+)', function ( req, res ) {
  res.send( { title: objectify( req.params.object ) + ' with id ' + req.params.id + ' updated' } );
});

app.get( '/:object/delete/:id([0-9]+)', function ( req, res ) {
  res.send( { title: objectify( req.params.object ) + ' with id ' + req.params.id + ' deleted' } );
});

app.get( '/', function ( req, res ) {
  res.send( { title: 'Express' } );
});

function objectify ( str ) {
  str = str.slice( 0, -1 );
  str = str.charAt( 0 ).toUpperCase() + str.substring( 1 ).toLowerCase();

  return str;
}

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
