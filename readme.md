# Compile-to-JavaScript Language Design and Implementation

## Intro

Cap is a language built on top of Javascript. It aims to unify the underlying concepts of
functional and prototypical programming with an elegant and succint syntax.

# Quickstart

The cap compiler is implemented in (node.js)[http://nodejs.org], get that first.

Then:

	git clone git@github.com:bengourley/Cap.git
	cd Cap
	npm install

You can now use the compiler at `./bin/capc`
  
  Usage: capc [options] <source-file>

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -p, --printtree  print the syntax tree instead of compiling