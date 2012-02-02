
// Module dependencies
var node = require('./node');

var dynamicId = function (spec) {

  spec.type = 'dynamicId';

  // Extend the generic node object
  var dynamicId = node(spec),
    call = spec.call,
    prop = spec.prop;

  // Returns a human readable representation of the node
  dynamicId.print = function () {
    return '<< ' + call.print() + ' >>.' + this.prop;
  };

  // Returns the node compiled to js
  dynamicId.compile = function (options) {
    return (options.shouldReturn ? 'return ' : '') +
      call.compile({}) + '.' + prop.compile();
  };

  return dynamicId;

};

module.exports = dynamicId;
