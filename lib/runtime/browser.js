
// Implement the require/module
// loading patten in the browser
// and a means to error

(function () {

  // Store for the modules
  var modules = {};

  // Require a module by name
  var require = function (module) {
    try {
      return modules[module].exports;
    } catch (e) {
      throw new Error('Cannot find module `' + module + '`');
    }
  };

  // Create a module
  var module = function (name) {
    modules[name] = {
      exports : {}
    };
    return modules[name];
  };

  // Get a module's `exports` object
  var exports = function (name) {
    return modules[name].exports;
  };

  // Proxy function to the throw statement
  var _throw = function (msg) {
    throw new Error(msg);
  };

  // Make functions global
  window.require = require;
  window._module = module;
  window._exports = exports;
  window._throw = _throw;

}());