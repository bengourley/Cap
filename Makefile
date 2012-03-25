REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

test-cov: lib-cov
	@COVERAGE=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@open coverage.html

lib-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov

docclean:
	@rm -rf docs/

docs: docclean
	docco lib/*.js

.PHONY: test test-cov docs lib-cov