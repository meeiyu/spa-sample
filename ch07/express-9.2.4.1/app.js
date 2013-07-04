var express = require('express');

var app = express.createServer();

app.use( express.logger() );

app.get('/', function( req, res ){
    res.send('Hello World');
});

app.listen(3000);