# Cap

A language that compiles to JavaScript, for use in the browser and node.

## Intro

Cap is a language built on top of Javascript. It aims to unify the underlying concepts of
functional programming with an elegant and succint syntax.

# Quickstart

The Cap compiler is implemented in [node](http://nodejs.org), get that first (pre-compiled binaries available for Win/Mac, Linux you have to build yourself). Node comes with the package manager `npm` which you can use to install the Cap compiler.

Then:

	npm install cap -g

Provided you used the global flag `-g` and the path `/usr/local/bin` is in your path, `capc` should now be available. Verify by running `capc -h` which should print something similar to the following:

  Usage: capc [options] [source-file]

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -p, --printtree  print the syntax tree instead of compiling

### Editor Syntax

There is a syntax mode for Textmate and SublimeText 2. It is located in `editor/Cap.tmLanguage`.