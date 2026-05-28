// Webpack-compatible replacement for handlebars-helpers/lib/utils/utils.js
// The original uses lazy-cache which dynamically rewrites require() in a way
// that breaks webpack. This shim does the same thing with eager static requires.

'use strict';

module.exports = {
  // Array utils
  sortBy: require('array-sort'),
  flatten: require('arr-flatten'),

  // Html utils
  block: require('to-gfm-code-block'),
  tag: require('html-tag'),

  // JavaScript language utils
  typeOf: require('kind-of'),

  // matching utils
  isGlob: require('is-glob'),
  mm: require('micromatch'),
  falsey: require('falsey'),

  // Number utils
  isEven: require('is-even'),
  isNumber: require('is-number'),

  // Object utils
  createFrame: require('create-frame'),
  getObject: require('get-object'),
  get: require('get-value'),
  forOwn: require('for-own'),

  // Path utils
  relative: require('relative')
};
