/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global require, process, module */

var
  socket = require( 'socket.io' ),
  crud   = require( './crud.js' );

module.exports = {
  connect : function ( app ) {
    var io = socket.listen( app ),
      chatter_map = {},
      emit_user_list, sign_on, sign_off;

    // avoid socket.io blacklist 
    io.set( 'blacklist' , [] );

    io
      .of( '/chat' )
      .on( 'connection', function ( socket ) {

        socket.on( 'adduser', function ( user_map ) {
        });

        socket.on( 'updatechat', function ( arg_map ) {
        });

        socket.on( 'leavechat', function () {
        });

        socket.on( 'disconnect', function () {
        });

    });

  }
};

