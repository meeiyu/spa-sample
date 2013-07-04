/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global require, process, module */

// Future referenece:
// In Socket.IO 0.7+ we have a clients method on the namespaces,
// which returns a array of all connected sockets.  API for a namespace:
// var client_list = io.of('/chat').clients(); // all clients
// var red_list    = io.of('/chat').clients('red'); // all clients from room 'red'
// See http://stackoverflow.com/questions/6563885

'use strict';
var
  socket = require( 'socket.io' ),
  crud   = require( './crud.js' );

module.exports = {
  connect : function ( app ) {
    var io = socket.listen( app ),
      chatter_map = {},
      emit_user_list, sign_on, sign_off;

    // For some reason, socket.io blacklists 'disconnect'
    // because it is apparently open to spoofing, but then
    // so is everything else.  Enabling it gives us excellent
    // disconnection response and uses the built-in heartbeat
    // capability.
    //
    io.set( 'blacklist' , [] );

    io
      .of( '/chat' )
      .on( 'connection', function ( socket ) {

        // 'adduser' message handler
        // user_map should have the following properties:
        //   name    = the name of the user
        //   cid     = the client id
        //   css_map = the css map for avatar position + color
        // If a user with the provided name already exists in mongo,
        //   we use the existing user and ignore other input.
        // If a user with the provided name does not exist in mongo,
        //   we create one and emit a 'userupdate' message to
        //   the sender so that a login cycle can complete.  We
        //   ensure the client id is passed back so the client
        //   can correlate the user, although this is not stored in
        //   mongo.
        // In all cases, the user is marked as 'online' and we emit
        // the updated chatter list to all clients (including the
        // original sender).
        //
        socket.on( 'adduser', function ( user_map ) {
          var cid;
          crud.read(
            'users',
            { name: user_map.name },
            { },
            function ( result_list ) {
              var result_map,
              user_exists = ( result_list && result_list.length > 0 );

              // use existing user with provided name
              if ( user_exists ) {
                result_map = result_list[ 0 ];
                sign_on( result_map._id , socket );
                socket.emit( 'userupdate', result_map );
              }

              // create user with new name
              else {
                cid = user_map.cid;
                delete user_map.cid;
                user_map.is_online = true;

                crud.construct(
                  'users',
                  user_map,
                  function ( result_list ) {
                    result_map = result_list[ 0 ];

                    if ( cid ) { result_map.cid = cid; }

                    socket.user_id = result_map._id;
                    chatter_map[ result_map._id ] = socket;
                    socket.emit( 'userupdate', result_map );
                    emit_user_list();
                  }
                );
              }
            }
          );
        });

        // 'updatechat' message handler
        // arg_map should have following properties:
        //   dest_id   = id of recipient
        //   dest_name = name of recipient
        //   sender_id = id of sender
        //   msg_text  = message text
        // If the recient is online, the arg_map is emitted to him.
        // If not, a 'user has gone offline' message is
        //   emitted to the sender.
        //
        socket.on( 'updatechat', function ( arg_map ) {
          if ( chatter_map.hasOwnProperty( arg_map.dest_id ) ){
            chatter_map[ arg_map.dest_id ]
              .emit( 'updatechat', arg_map );
          }
          else {
            socket.emit( 'updatechat', {
              sender_id : arg_map.sender_id,
              msg_text  : arg_map.dest_name + ' has gone offline.'
            });
          }
        });

        socket.on( 'leavechat', function () {
          sign_off( socket.user_id );
        });

        socket.on( 'disconnect', function () {
          sign_off( socket.user_id );
        });

    });

    // helper function to update is_online property
    //
    sign_on = function ( user_id , socket ) {
      crud.update(
        'users',
        { '_id' : user_id },
        { is_online : true },
        function () { emit_user_list(); }
      );
      chatter_map[ user_id ] = socket;
      socket.user_id = user_id;
    };

    // helper function to broadcast to all connected clients
    //
    emit_user_list = function () {
      // avoid race condition
      if ( ! io ) { return false; }

      crud.read(
        'users',
        { is_online : true },
        { },
        function ( result_list ) {
          // broadcast to all on namespace
          // see http://stackoverflow.com/questions/6477770
          io.of('/chat').emit( 'listchange', result_list );
        }
      );
    };

    // helper function to update is_online property
    sign_off = function ( user_id ) {
      crud.update(
        'users',
        { '_id' : user_id },
        { is_online : false },
        function () { emit_user_list(); }
      );
      delete chatter_map[ user_id ];
      // socket.disconnect() // is this a good idea?
    };
  }
};

