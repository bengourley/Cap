(function () {

  console.log('running');

  // Global functions for
  // compiled Cap programs

  var _throw = function (msg) {
    throw new Error(msg);
  };

  if (typeof global !== 'undefined') {
    global._throw = _throw;
  }

}());