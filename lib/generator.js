var indentHandler = require('./indentHandler')();

var createGenerator = function () {
  
  var generator = {};

  generator.generate = function (ast) {
    
    (function walkNode(node) {
      console.log(indentHandler.getIndent() + node.print());
      indentHandler.nextIndent();
      node.childNodes.forEach(function (childNode) {
        walkNode(childNode);
      });
      indentHandler.prevIndent();
    }(ast));

  };

  generator.printTree = function (ast) {
    
    (function walkNode(node) {
      console.log(indentHandler.getIndent() + node.print());
      indentHandler.nextIndent();
      node.childNodes.forEach(function (childNode) {
        walkNode(childNode);
      });
      indentHandler.prevIndent();
    }(ast));

  };

  return generator;

};

module.exports = createGenerator;