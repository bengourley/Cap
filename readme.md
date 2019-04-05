# Cap

Cap was my final year project for my BSc. It's a language that compiles to JavaScript, for use in the browser and node. It takes inspiration from JavaScript, CoffeeScript, Jade, Stylus, Python and ML. **The reason I'm open sourcing it is just for show. I wouldn't recommend using it in production, in fact, I'd definitely recommend not using it.** Feel free to try it out though, and I'm happy to help out if you get stuck with that.

## Intro

Cap is a language built on top of Javascript. It aims to unify the underlying concepts of
functional programming with an elegant and succinct syntax.

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

### Syntax

```

# Assignment
greeting = 'Hello, World!'

# Function calls
console.log greeting

# Literals
myObject = {}
  keyOne = 1
  keyTwo = 2
  keyThree = 3

myArray = []
  'one'
  'two'
  'three'

myFunction = |x|
  # The last expression
  # is implicitely returned
  # from a function
  x + x

```

I admit this is brief, so feel free to check out the full
syntax guide in report at http://bengourley.github.com/Cap/report.pdf.

### Editor Syntax

There is a syntax mode for Textmate and SublimeText 2. It is located in `editor/Cap.tmLanguage`.
