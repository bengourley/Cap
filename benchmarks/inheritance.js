var Vehicle = function () {};
Vehicle.prototype.drive = function (dist) {
  console.log('Driving ' + dist + ' miles');
};

var Car = function () {};
Car.prototype = new Vehicle();
Car.prototype.wheels = 4;

var ReliantRobin = function () {};
ReliantRobin.prototype = new Car();
reliantRobin = new ReliantRobin();
reliantRobin.wheels = 3;
reliantRobin.drive(10);

console.log('Reliant has ' + reliantRobin.wheels + ' wheels');
console.log('But its prototype has ' + ReliantRobin.prototype.wheels + ' wheels');