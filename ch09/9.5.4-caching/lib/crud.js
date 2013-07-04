/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global require, process, module */

'use strict';
var
  mongodb     = require( 'mongodb' ),
  mongoserver = new mongodb.Server(
    'localhost',
    mongodb.Connection.DEFAULT_PORT
  ),
  db          = new mongodb.Db( 'spa', mongoserver ),
  ObjectID    = mongodb.ObjectID,
  fs          = require( 'fs' ),
  jsv         = require( 'JSV' ).JSV.createEnvironment(),
  cache       = require( './cache.js' ),
  schemaMap   = { 'users': {} },
  checkSchema, loadSchema, schemaPath, schemaName, crud;

db.open( function () {
  var set_all_users_as_offline = function () {
    crud.update(
      'users',
      { is_online : true },
      { is_online : false },
      function () { }
    );  
  };

  console.log( 'connected to Mongo' );
  set_all_users_as_offline();
});

loadSchema = function ( err, data ) {
  schemaMap[ schemaName ] = JSON.parse( data );
};

for ( schemaName in schemaMap ) {
  if ( schemaMap.hasOwnProperty( schemaName ) ){
    schemaPath = __dirname.replace('/lib','/')
      + schemaName + '.json';

    fs.readFile( schemaPath, 'utf8', loadSchema );
  }
}

checkSchema = function ( object, schema, callback ) {
  var report = jsv.validate( object, schema ),
      pass_validation = ( report.errors.length === 0 );

  callback( pass_validation );
};

crud = {
  // construct === create.  create is a root Object method in js.
  'construct' : function ( object_type, object_map, callback ) {
    checkSchema(
      object_map,
      schemaMap[ object_type ],
      function ( pass_validation ) {
        var obj_map = object_map;
        if ( pass_validation ) {
          db.collection( object_type, function ( err, collection ) {
            var options_map = { safe: true };
            collection.insert(
              obj_map,
              options_map,
              function ( err, result ) {
                callback( err, result );
              }
            );
          });
        }
        else {
          console.error( 'Did not pass validation' );
        }
      }
    );
  },

  'read': function ( object_type, find_map, fields_map, callback ) {
    var cache_key = find_map;

    cache.get( cache_key, callback, function () {
      db.collection( object_type, function ( err, collection ) {
        collection.find( find_map, fields_map ).toArray(
          function ( err, result ) {
            cache.set( cache_key, result );
            callback( err, result );
          }
        );
      });
    });
  },

  'update': function ( object_type, find_map, object_map, callback) {
    var cache_key = find_map;

    checkSchema(
      object_map,
      schemaMap[ object_type ],
      function ( pass_validation ) {
        if ( pass_validation ) {
          db.collection( object_type, function ( err, collection ) {
            collection.update(
              find_map,
              { $set : object_map },
              { safe : true, multi : true, upsert : false },
              function ( err, result ) { 
                cache.set( cache_key, result );
                callback( result );
              }
            );
          });
        }
        else {
          console.error( 'Did not pass validation' );
        }
      }
    );
  },

  // destroy === delete.  delete is a reserved word.
  'destroy': function ( object_type, find_map, callback ) {
    var cache_key = find_map;

    db.collection( object_type, function ( err, collection ) {
      var options_map = { safe: true, single: true };

      collection.remove( find_map, options_map,
        function ( err, result ) {
          cache.del( cache_key );
          callback( result );
        }
      );
    });
  },
  schema_map: schemaMap,
  ObjectID  : ObjectID
};

module.exports = crud;

