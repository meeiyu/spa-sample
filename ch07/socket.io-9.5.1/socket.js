var fs = require('fs')
  , url = require('url')
  , path = require('path')
  , express = require('express')
  , app = express.createServer()  
  , io = require('socket.io').listen(app)  
  , root = __dirname + '/public';

app.use( function ( req, res, next ) {  
  req.on('static', function () {  
    var file = url.parse( req.url ).pathname
      , mode = 'stylesheet';
      
    if ( file[ file.length - 1 ] == '/' ) {
      file += 'index.html';
      mode = 'reload';
    }
    if ( file[ 1 ] == 'j' ) {
      mode = 'script';
    }
    createWatcher(file, mode); 
  });
  next();
});

app.use(express.static(root));  

var watchers = {};  

function createWatcher (file, event) {
  var absolute = path.join(root, file);

  if (watchers[absolute]) {
    return;
  }
  
  fs.watchFile(absolute, function (curr, prev) { 
    if (curr.mtime !== prev.mtime) {  
      io.sockets.emit(event, file);
    }
  });

  watchers[absolute] = true; 
}

app.listen( 3000 );