
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

  // Inheritence
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

  // Make functions global
  window._require = require;
  window._module = module;
  window._exports = exports;
  window._throw = _throw;
  window.extend = extend;

  // ES5 Polyfills

  // `Object.create(proto, props)`
  // Adapted from: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
  if (!Object.create) {
    Object.create = function (o, props) {
      function F() {}
      F.prototype = o;
      var obj = new F();
      Object.keys(props).forEach(function (k) {
        obj[k] = props[k].value;
      });
      return obj;
    };
  }

  // `Object.keys()`
  // Source: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
  if (!Object.keys) {
    Object.keys = (function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null)
          throw new TypeError('Object.keys called on non-object');

        var result = [];

        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) result.push(prop);
        }

        if (hasDontEnumBug) {
          for (var i=0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
          }
        }
        return result;
      };
    })();
  }

  // `Array.forEach(fn)`
  // Source https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
  if ( !Array.prototype.forEach ) {

    Array.prototype.forEach = function( callback, thisArg ) {

      var T, k;

      if ( this == null ) {
        throw new TypeError( " this is null or not defined" );
      }

      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0; // Hack to convert O.length to a UInt32

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if ( {}.toString.call(callback) != "[object Function]" ) {
        throw new TypeError( callback + " is not a function" );
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if ( thisArg ) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while( k < len ) {

        var kValue;

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if ( k in O ) {

          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[ k ];

          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call( T, kValue, k, O );
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }

}());