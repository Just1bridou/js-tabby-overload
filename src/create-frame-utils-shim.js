// Webpack-compatible replacement for create-frame/utils.js
// (avoids lazy-cache's dynamic require rewriting)

'use strict';

module.exports = {
  define: require('define-property'),
  extend: require('extend-shallow'),
  isObject: require('isobject')
};
