(function () {
  var listeners = [];
  var emit = function emit(eventname) {
    var __notify = function __notify(listener) {
      if (eventname === listener.eventname) {
        (function () {
          var __event = {
            name: eventname
          };
          return listener.callback(__event);
        }());
      }
    };
    return listeners.forEach(__notify);

  };
  var listen = function listen(eventname, callback) {
    var __listener = {
      eventname: eventname,
      callback: callback
    };
    return listeners.push(__listener);

  };
  var __start = function __start() {
    return console.log('Starting 1!');
  };
  listen('start', __start);

  __start = function __start() {
    return console.log('Starting 2!');
  };
  listen('start', __start);

  __start = function __start() {
    return console.log('Starting 3!');
  };
  listen('start', __start);

  var __end = function __end() {
    console.log('Finished!');
    return deferred.resolve();
  };
  listen('end', __end);

  emit('start');
  return emit('end');
}());