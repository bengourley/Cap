(function () {
  var vehicle = {
    drive: function drive(dist) {
      return console.log('' + 'Driving ' + '' + dist + ' miles');
    }
  };
  var car = extend(vehicle)(null);
  car.wheels = 4;
  var reliantRobin = extend(car)(null);
  reliantRobin.wheels = 3;
  reliantRobin.drive(10);
  console.log('' + 'Reliant has ' + '' + reliantRobin.wheels + ' wheels');
  return console.log('' + 'But its prototype has ' + '' + _super(reliantRobin).wheels + 'wheels');
}());