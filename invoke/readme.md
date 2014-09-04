# invoke service

Applies methods on an object based on incoming
sets of arguments.

## input format :

  [
    ['set', 'propname', 'value'],
    ['unset', 'otherprop']
  ]

## To use :

  var invoke = require('graft-invoke');
  var context = new Object();

  applyStream.pipe(invoke(context));
