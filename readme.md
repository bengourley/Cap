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


    Usage: capc [options]

    Options:

      -h, --help             output usage information
      -V, --version          output the version number
      -t, --printtree        print the syntax tree instead of compiling (forces --print)
      -p, --print            print the output instead of writing to file
      -c, --compress         compress the output
      -e, --targetenv <env>  specify the compilation target (defaults to node)
      -f, --files <a,b..>    compile only the given files (comma separated list)

    Examples:

        $ capc

      Recursively scans the current directory and
      and compiles all the `.cap` files it finds

        $ capc -e browser main

      Recursively scans the current directory and
      and compiles all the `.cap` files, bundling
      them into a single file `main.browser.cap.js` with some
      boilerplate code that will make it run in the
      browser. Uses the given file as the program entry point

        $ capc -e node -f example.cap

      Compiles example.cap → example.cap.js for running in node

### Editor Syntax

There is a syntax mode for Textmate and SublimeText 2. It is located in `editor/Cap.tmLanguage`.