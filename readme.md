# Compile-to-JavaScript Language Design and Implementation

## Intro

Cap is a language built on top of Javascript. It aims to unify the underlying concepts of
functional and prototypical programming with an elegant and succint syntax.

# Quickstart

To get up and running you need node.js and npm. Go get them first.

Then do:

	cd /path/to/where/you/want/
	git clone git@github.com:bengourley/Cap.git
	cd Cap
	npm install

If that works, you should then be able to compile files like so:

	./bin/capc example.cap

Which currently outputs:

	(function () {
		var tick = function (e) {
    		return console.log('tick');
		};
		var _rv = setInterval(tick, 1000);
		delete tick;
		return _rv;
	}());

You can then paste this in to a file and run it with node, or I generally open up Chrome and paste it in to the console.

# Grammar

This outlines the proposed Cap grammar, and is a work in progress.

## Expressions:

Expressions return a value. In Cap, a value can one of the following generalised
types: a string, a number, an object, an array or a function. (Any other types? Object is pretty generic)

The following are examples of Cap expressions:

	2+3

	object:
		property value
		addTen function: arg
			return arg + 10

	array: 'dog' 'cat' 'human' or ['dog' 'cat' 'human']

	array:
		'dog'
		'cat'
		'human'

	function: arg
		return 'The arg was: ' + arg

## Assignment:

The equals sign is used to assign a value to a variable for later use. Variables do
not have to declared before they are used. Like JavaScript, variables have function-scope.

The following are examples of assignments:

	result = 2 + 3

	variableName = object:
		property value
		etc etc

	myArray = array: 'dog' 'cat' 'human'

	my2dArray = array:
		array 'dog' 'cat' 'human'
		array 'fish' 'crab' 'duck'

	myComplexObject = object:
		water array:
			'fish'
			'crab'
			'duck'
		land array:
			'dog'
			'cat'
			'human'

	myFunction = function: arg
		return arg + 10

## Accessing object properties:

Using the . syntax

	myObject.prop

(Also to decide whether to allow ['xyz'] syntax for building strings programmatically, eg. myObject['prop'])


## Invocation:

A function is invoked by appending an argument. All functions take one argument.

	myFunction 100

## Using a returned value

A function invocation can be used as an expression. The result is the value that is returned
by the function.

	result = myFunction 'thing'
	
	// Nested function calls
	myFunction (myOtherFunction 20)

## Tuples

The single argument that a function takes can be a tuple. A tuple is essentially a wrapper for many arguments. This means you can call native js function.

	myJSFunction ('many', 'arguments', 10)

In Cap a better way for a function to take many arguments is to create a single 'options' object and pass that to the function like so:

	options = object:
		amount 'many'
		type 'arguments'
		value 10
	myCapFunction options

As you can see, this also names the arguments – enhancing readability at the location of the callee.

## Function Chaining

If the result of a function is another function, it can be invoked immediately by juxtaposing another argument.

	object.getMeAMethod 'foo' 'arg'

## Cascading

It would be nice to build in the ability to cascade, with something like the syntax below:

	with jQuery '.item'
		width '100px'
		height '100px'
		animate props where
			props = array:
				object:
					opacity 1
				300
				function:
					console.log 'finished'


## Argument placeholders and the where clause

Argument placeholders serve two purposes: 1. to enable passing complex objects
as arguments and 2. to enhance legibility.

A placeholder is named with any valid identifier, and must be defined immediately after the
closing parenthesis of the function call, with an indent.

	doSomething options where
		options = object:
			speed 10
			onEnd function:
				return 'hello'

	(jQuery '#id').bind ('click', callback)
		callback = function: e
			console.log e.target


## Objects and inheritance

TODO

_________

## Roadmap / Braindump

- Syntax
	- Significant whitespace
	- Function literals
	- It would be nice to have array and object literals
- Things to take from javascript
	- First class functions
	- Function scope
- Things to build in, inspired by JS libraries
	- Sizzle selector for DOM
	- Animation (jQuery,MooTools)
	- Custom Events
	- Browser polyfills
	- Ajax
- DOM helpers
	- Potentially meta-programming
	- Event handlers for different browsers
	- Potentially animation functions?
	- Macros?
- Debugging
	- Browser plugin
	- Compiler option to output source line number in generated code
- Development
	- VIM syntax mode
	- Lint?
- Generator
	- Write in javascript
- Testing
	- Tests for compiler - jasmine? (BDD)
	- Testing framework (TDD, BDD?) for new language
- Compiler / Miscellaneous improvements
	- Wrap all code in (function() {})(); for local variable safety
	- Sort out ‘this’ confusion
	- Object.create() – and other ECMAScript proposed improvements
	- See traceur
	- Default argument values
	- Explicit foreach loop
	- Amendments to syntax
	- Remove semi-colon
	- Significant whitespace
	- Remove brackets?
	- Smart type coersion? i.e. try a method, if it fails due to not being the right type, try to construct the right type out of the current object
