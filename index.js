var coverage = process.env.COVERAGE;

module.exports.lexer = coverage
  ? require('./lib-cov/lexer')
  : require('./lib/lexer');

module.exports.parser = coverage
  ? require('./lib-cov/parser')
  : require('./lib/parser');

module.exports.token = coverage
  ? require('./lib-cov/token')
  : require('./lib/token');