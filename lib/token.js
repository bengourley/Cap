// Provides a simple token
// creator function.

// `token()` takes one argument
// which should contain at least
// a `type` property and optionally
// a `value` property.
var token = function (spec) {

  // Create the token object.
  // Set its type and value. If no
  // value was given, default to the
  // empty string `''`.
  var token = {};
  token.type = spec.type;
  token.value = spec.value || '';

  // Return the new token.
  return token;

};

module.exports = token;