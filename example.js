(function () {

/* Cap runtime */

/* Proxies to JS functionality */

var __console = {
  __log : console.log,
  __warn : console.warn
};

var __print = __console.__log;

  return __print('Im fine');

}());