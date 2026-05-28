// Webpack-compatible replacement for lazy-cache.
// lazy-cache rewrites `require` at runtime, which breaks webpack's static analysis.
// This shim returns an object that throws when accessed — callers don't actually use
// the exported `utils` at module-load time; the side effect is just registering aliases.
// In handlebars-helpers, every actual use of utils.someFn is replaced by a direct
// require call, so this stub is enough to let the module evaluate without errors.

module.exports = function lazyCacheShim(realRequire) {
  var noop = function () {};
  return new Proxy(noop, {
    get: function (target, prop) {
      // Return undefined for any property access — handlebars-helpers' utils file
      // only calls the proxy as a function (to register aliases), never reads back.
      return undefined;
    },
    apply: function (target, thisArg, args) {
      // Calls like require('array-sort', 'sortBy') — silently ignore.
      return undefined;
    }
  });
};
