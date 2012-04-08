(function () {

  // Global functions for
  // compiled Cap programs

  var _throw = function (msg) {
    throw new Error(msg);
  };

  var extend = function (proto) {
    return function (obj) {
      var props = {};
      Object.keys(obj).forEach(function (k) {
        props[k] = {
          value : obj[k],
          writeable : true,
          configureable : true,
          enumberable : true
        };
      });
      return Object.create(proto, props);
    };
  };

  global._throw = _throw;
  global.extend = extend;

}());