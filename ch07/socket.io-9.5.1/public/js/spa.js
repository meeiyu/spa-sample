/*
 *   spa.js
 *   Base module for spa application
 *
 *   Michael S. Mikowski - mike.mikowski@gmail.com
 *   Copyright 2011,2012 Manning Publications Co.
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : true,
  white  : true
*/

/*global $, spa */

var spa = (function (){
  var initModule = function (){
    spa.shell.initModule($('#spa'));
  };
  return { initModule: initModule };
}());
