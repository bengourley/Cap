# Compile-to-JavaScript Language Design and Implementation

## Intro

Cap is a language built on top of Javascript. It aims to unify the underlying concepts of
functional and prototypical programming with an elegant and succint syntax.

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


# Grammar

This outlines the proposed Cap grammar, and is a work in progress.

## Expressions:

Expressions return a value. In Cap, a value can one of the following generalised
types: a string, a number, an object, an array or a function. (Any other types? Object is pretty generic)

The following are examples of Cap expressions:

	2+3

	object:
		property value
		function arg1 arg2 arg3
			return arg1 + arg2 + arg3

	array: 'dog' 'cat' 'human' or ['dog' 'cat' 'human']

	array:
		'dog'
		'cat'
		'human'

	function: arg1 arg2 arg3
		return arg1 + arg2 + arg3

## Assignment:

The equals sign is used to assign a value to a variable for later use. Variables do
not have to declared before they are used. Like JavaScript, variables have function-scope.

The following are examples of assignments:

	result = 2+3

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

	myFunction = function: arg1 arg2 arg3
		return arg1 + arg2 + arg3

## Accessing object properties:

Using the . syntax

	myObject.prop

(Also to decide whether to allow ['xyz'] syntax for building 
strings programmatically, eg. myObject['prop'])


## Invocation:

A function is invoked by appending a tilde (~) to the function's name. Arguments follow separated by a space.

	myFunction~ 1 2 3


## Using a returned value

A function invocation can be used as an expression. The result is the value that is returned
by the function (if anything).

	result = myFunction~ 1 2 3
	
	// Nested function calls
	myFunction~ (myOtherFunction~ 1 2 3) 2 3


## Function Chaining

If the result of a function is another function, it can be invoked immediately by
wrapping in parens and appending the tilde.

	(object.getMeAMethod~ 'foo')~

## Cascading

It would be nice to build in the ability to cascade, with something like the syntax below:

	with $~ '.item'
		width~ '100px'
		height~ '100px'
		animate~ {props}
			props = array:
				object:
					opacity 1
				300
				function:
					console.log~ 'finished'


## Lazy arguments

Lazy arguments serve two purposes: 1. to enable passing annonymous functions
as arguments and 2. to enhance legibility.

A placeholder is named with curly braces '{}', and must be defined immediately after the
closing parenthesis of the function call, with an indent.

	doSomething~ {options}
		options = object:
			speed 10
			onEnd function:
				return 'hello'

How to deal with multiple placeholders and arrays...?

## Annonymous Functions as arguments

Functions can be passed as the last argument to a function with the comma, since this is
the most common behviour (for use as a callback function).

The following code is equivalent:

	($~ '#id').bind~ 'click' function:e,
			console:(log e.target)

	($~ '#id').bind~ 'click' {callback}
		callback = function: e
			console.log~ e.target


## Objects and inheritance

TODO!

