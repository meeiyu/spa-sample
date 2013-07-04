/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global require, process, module */

'use strict';
var
  redisDriver = require( "redis" ),
  redis       = redisDriver.createClient(),
  cache, makeKey;

makeString = function ( raw_string ) {
  var str;

  if ( typeof raw_key == "String" ) {
    str =  raw_string;
  } else {
    str = JSON.stringify( raw_string );
  }
  return str;
};

cache = {
  'set': function ( key, value ) {
    redis.set( makeString( key ), makeString( value ) );
  },

  'get': function ( key, hit_callback, miss_callback ) {
    redis.get( makeString( key ), function( err, reply ) {
      if ( ! reply ) {
        console.log( 'MISS' );
        miss_callback();
      } else {
        console.log( 'HIT' );
        hit_callback( reply );
      }
    });
  },

  'del': function ( key ) {
    redis.del( makeString( key ) );
  }
};

module.exports = cache;

