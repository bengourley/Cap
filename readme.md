# Compile-to-JavaScript Language Design and Implementation

## Intro

Cap is a language built on top of Javascript. It aims to unify the underlying concepts of
functional and prototypical programming with an elegant and succint syntax.

## Goals

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
