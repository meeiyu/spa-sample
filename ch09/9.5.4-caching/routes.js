/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global require, process, module, ObjectID */

var chat = require( './lib/chat.js' ),
    crud = require( './lib/crud.js' ),
    ObjectID = crud.ObjectID;

module.exports = function( app ) {
  var routes = {
    set: function () {

      app.all( '/:object/*?', function ( req, res, next ) {
        var is_valid_object
          = ( !! crud.schema_map[ req.params.object ] );
        res.contentType( 'json' );

        if ( is_valid_object ) { next(); }
        else {
          res.send( req.params.object
            + " is not a valid object type"
          );
        }
      });

      app.get( '/:object/list', function ( req, res ) {
        crud.read(
          req.params.object,
          {}, {},
          function ( result ) { res.send( result ); }
        );
      });

      app.post( '/:object/create', function ( req, res ) {
        crud.construct(
          req.params.object,
          req.body,
          function ( result ) { res.send( result ); }
        );
      });

      app.get( '/:object/read/:id', function ( req, res ) {
        var find_map = { _id: ObjectID( req.params.id ) };

        crud.read(
          req.params.object,
          find_map,
          {},
          function ( err, result ) { 
            res.send( result ); 
          }
        );
      });

      app.post( '/:object/update/:id', function ( req, res ) {
        var find_map    = { _id: ObjectID( req.params.id ) },
            object_map  = req.body,
            object_type = req.params.object;

        crud.update(
          object_type,
          find_map,
          object_map,
          function ( result ) { res.send( result ); }
        );
      });

      app.get( '/:object/delete/:id', function ( req, res ) {
        var object_map = { _id: ObjectID( req.params.id ) };

        crud.destroy(
          req.params.object,
          object_map,
          function ( result ) { res.send( result ); }
        );
      });

      app.get( '/', function (req, res) {
        res.redirect( '/spa.html' );
      });
    }
  };

  chat.connect( app );

  return routes;
};
