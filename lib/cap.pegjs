
/* Initializer */
{
	var indentStack = [''];
}

start
  = line +

line
	= indent lineContent

indent
	= space:[\t]* {

		var indent = space.join(''),
				lastIndent = indentStack[indentStack.length - 1];

		console.log(indentStack);

		if (indent === lastIndent) {
			return '';
		}  else if (indent.indexOf(lastIndent) === 0) {
			indentStack.push(indent);
			return {
				indent : indentStack.length - 1
			};
		} else {

			if (indent.length === 0) {
				indentStack = indentStack.slice(0,1);
				return {
					outdent : 0
				};
			}
			
			while (indentStack.length && lastIndent !== indent) {
				lastIndent = indentStack.pop();
			}

			if (indentStack.length) {
				return {
					outdent : indentStack.length - 1
				};
			} else {
				return 'Inconsistent indentation';
			}
		}

	}

lineContent
	= integer '\n'*

integer 'integer'
  = digits:[0-9]+ { return parseInt(digits.join(''), 10); }
