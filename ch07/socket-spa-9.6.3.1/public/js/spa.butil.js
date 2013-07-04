/*
 * spa.butil.js
 * Browser utilities ported for SPA
 *
 * Michael S. Mikowski - mmikowski@gmail.com
 * These are routines I have created, compiled, and updated
 * since 1998, with inspiration from around the web.
 *
 * MIT License
 *
*/

/*jslint         browser : true,  continue : true,
 devel  : true,  indent  : 2,     maxerr   : 50,
 newcap : true,  nomen   : true,  plusplus : true,
 regexp : true,  sloppy  : true,  vars     : true,
 white  : true
 */

/*global $, spa */

spa.butil = (function () {
  var makeError, setConfigMap;

  // Begin Public constructor /makeError/
  // A convenience wrapper to create an error object
  makeError = function ( name, message, data ) {
    var error     = new Error();
    error.name    = name;
    error.message = message;

    if ( data ){ error.data = data; }

    return error;
  };
  // End Public constructor /makeError/

  // Begin Public method /setConfigMap/
  // Common code to set configs in components
  setConfigMap = function ( arg_map ){
    var
      input_map    = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map   = arg_map.config_map,
      key_name, error;

    for ( key_name in input_map ){
      if ( input_map.hasOwnProperty( key_name ) ){
        if ( settable_map.hasOwnProperty( key_name ) ){
          config_map[key_name] = input_map[key_name];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key_name + '| is not supported'
          );
          console.error(error);
          throw error;
        }
      }
    }
  };
  // End Public method /setConfigMap/

  return {
    makeError    : makeError,
    setConfigMap : setConfigMap
  };

}());

