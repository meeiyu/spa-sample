/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global require, process, module, ObjectID */

var
  mongodb     = require( 'mongodb' ),
  mongoserver = new mongodb.Server( 'localhost',
                  mongodb.Connection.DEFAULT_PORT ),
  db          = new mongodb.Db( 'spa', mongoserver ),
  ObjectID    = mongodb.ObjectID,
  schemaMap   = { 'users': {} };

db.open( function () {
  console.log( 'connected to Mongo' );
});

module.exports = function( app ) {
  return {
    set: function () {
      app.all( '/:object/*?', function ( req, res, next ) {
        res.contentType( 'json' );
        if ( schemaMap[ req.params.object ] ) {
          next();
        }
        else {
          res.send( req.params.object
            + ' is not a valid object type' );
        }
      });

      app.get( '/:object/list', function ( req, res ) {

        db.collection(
          req.params.object,
          function ( err, collection ) {
            collection.find().toArray(
              function ( err, result ) { res.send( result ); }
            );
          }
        );

      });

      app.post( '/:object/create', function ( req, res ) {
        db.collection(
          req.params.object,
          function ( err, collection ) {
            var
              options_map = { safe: true },
              object_map  = req.body;
            
            collection.insert(
              object_map,
              options_map,
              function ( err, result ) {
                res.send( result );
              }
            );
          }
        );
      });

      app.get( '/:object/read/:id', function ( req, res ) {
        var object_map = { _id: ObjectID( req.params.id ) };

        db.collection(
          req.params.object,
          function ( err, collection ) {
            collection.findOne(
              object_map,
              function ( err, result ) { res.send( result ); }
            );
          }
        );

      });

      app.post( '/:object/update/:id', function ( req, res ) {
        var
          find_map   = { _id: ObjectID( req.params.id ) },
          object_map = req.body;

        db.collection(
          req.params.object,
          function ( err, collection ) {
            var
              sort_order = [],
              options_map = {
                'new' : true, upsert: false, safe: true
              };

            collection.findAndModify(
              find_map,
              sort_order,
              object_map,
              options_map,
              function ( err, result ) {
                res.send( result );
              }
            );
          }
        );
      });

      app.get( '/:object/delete/:id', function ( req, res ) {
        var object_map = { _id: ObjectID( req.params.id ) };

        db.collection(
          req.params.object,
          function ( err, collection ) {
            var options_map = { safe: true, single: true };
      
            collection.remove(
              object_map,
              options_map, 
              function ( err, result ) { res.send( result ); }
            );
          }
        );
      });
    }
  };
};
