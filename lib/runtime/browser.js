// Implement the require/module
// loading patten in the browser
// and a means to error
(function () {

  // Store for the modules
  var _modules = {};

  // Require a module by name
  var require = function (module) {
    if (module.indexOf('./') === 0) module = module.substr(2);
    try {
      return _modules[module].exports;
    } catch (e) {
      throw new Error('Cannot find module `' + module + '`');
    }
  };

  // Create a module
  var _module = function (name) {
    _modules[name] = {
      exports : {}
    };
    return _modules[name];
  };

  // Get a module's `exports` object
  var _exports = function (name) {
    return _modules[name].exports;
  };

  var err = function (msg) {
    throw new Error(msg);
  };

  // Make functions global
  window.require = require;
  window._module = _module;
  window._exports = _exports;
  window.err = err;

}());