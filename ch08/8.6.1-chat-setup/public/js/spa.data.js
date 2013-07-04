/*
 * spa.data.js
 * data module
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
 * Copyright (c) 2011-2012 Manning Publications Co.
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global spa, io */

spa.data = (function (){
  'use strict';
  var
    stateMap = { sio : null },
    makeSio, getSio, initModule
    ;

  makeSio = function (){
    var socket = io.connect( '/chat' );

    return {
      emit   : function ( event_name, data ) {
        socket.emit( event_name, data );
      },
      on     : function ( event_name, callback ) {
        socket.on( event_name, function (){
          callback( arguments );
        });
      }
    };
  };

  getSio = function (){
    if ( ! stateMap.sio ) { stateMap.sio = makeSio(); }
    return stateMap.sio;
  };

  initModule = function (){};

  return {
    getSio     : getSio,
    initModule : initModule
  };
}());

