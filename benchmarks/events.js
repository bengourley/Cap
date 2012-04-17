var listeners = [];

var emit = function (eventname) {
  listeners.forEach(function (listener) {
    if (eventname === listener.eventname) {
      listener.callback({
        name : eventname
      });
    }
  });
};

var listen = function (eventname, callback) {
  listeners.push({
    eventname : eventname,
    callback : callback
  });
};

listen('start', function () {
  console.log('Starting 1!');
});

listen('start', function () {
  console.log('Starting 2!');
});

listen('start', function () {
  console.log('Starting 3!');
});

listen ('end', function () {
  console.log('Finished!');
  deferred.resolve();
});

emit('start');
emit('end');