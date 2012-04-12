(function () {

  // Global functions for
  // compiled Cap programs

  var _throw = function (msg) {
    throw new Error(msg);
  };

  var extend = function (proto) {
    return function (obj) {
      if (!obj) obj = {};
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

  var _super = function (obj) {
    return Object.getPrototypeOf(obj);
  };

  // Inheritence - trait
  var trait = function (t) {
    return function (obj) {
      if (!obj._traits) obj._traits = [];
      if (obj._traits.indexOf(t.name) === -1) obj = t.apply(obj);
      return obj;
    };
  };

  global._throw = _throw;
  global.extend = extend;
  global.trait = trait;
  global._super = _super;

}());