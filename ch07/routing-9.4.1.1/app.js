/**
 * Module dependencies.
 */
console.log('spa');
var express = require('express');

var app = module.exports = express.createServer();

// Configuration
app.configure(function (  ) {
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
app.all( '/users/*?', function ( req, res, next ) {
  res.contentType( 'json' );
  next();
});

app.get( '/users/list', function ( req, res ) {
  res.send( { title: 'Users list' } );
});

app.post( '/users/create', function ( req, res ) {
  res.send( { title: 'User created' } );
});

app.get( '/users/read/:id([0-9]+)', function ( req, res ) {
  res.send( { title: 'User with id ' + req.params.id + ' found' } );
});

app.post( '/users/update/:id([0-9]+)', function ( req, res ) {
  res.send( { title: 'User with id ' + req.params.id + ' updated' } );
});

app.get( '/users/delete/:id([0-9]+)', function ( req, res ) {
  res.send( { title: 'User with id ' + req.params.id + ' deleted' } );
});

app.get( '/', function ( req, res ) {
  res.send( { title: 'Express' } );
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
