(function () {

  // Global functions for
  // compiled Cap programs

  var _throw = function (msg) {
    throw new Error(msg);
  };

  // If running in node,
  // attach to the global
  // object
  if (typeof global !== 'undefined') {
    global._throw = _throw;
  }

  // If running in the browser,
  // attach to the window object
  if (typeof window !== 'undefined') {
    window._throw = _throw;
  }

}());