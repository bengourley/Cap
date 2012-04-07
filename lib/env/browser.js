
// Implement the require/module
// loading patten in the browser
// and a means to error

(function () {

  // Store for the modules
  var modules = {};

  // Require a module by name
  var require = function (name) {
    if (name.indexOf('.cap') === name.length - 4) {
      name = name.substr(0, name.length - 4);
    }
    var module = {
      exports : {}
    };
    if (!modules[name]) throw new Error('Cannot find module `' + name + '`');
    modules[name](module, module.exports);
    return module.exports;
  };

  // Create a module
  var module = function (name, module) {
    if (name.indexOf('.cap') === name.length - 4) {
      name = name.substr(0, name.length - 4);
    }
    modules[name] = module;
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
  window._require = require;
  window._module = module;
  window._exports = exports;
  window._throw = _throw;

}());