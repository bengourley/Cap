# Compile-to-JavaScript Language Design and Implementation

## Goals

- Miscellaneous improvements
	- Wrap all code in (function() {})(); for local variable safety
	- Throw error on var dec with ‘var’ missing
	- Sort out ‘this’ confusion
	- Object.create() – and other ECMAScript proposed improvements
	- See traceur
	- Default argument values
	- Explicit foreach loop
	- Amendments to syntax
	- Remove semi-colon
	- Significant whitespace
	- Remove brackets?
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
- Compiler
- Generator
	- Write in javascript
- Testing
	- Tests for compiler - jasmine? (BDD)
	- Testing framework (TDD, BDD?) for new language
