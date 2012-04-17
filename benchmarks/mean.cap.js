(function () {
  var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var sum = 0;
  var __add = function __add(item) {
    sum = sum + item;
    return sum;
  };
  arr.forEach(__add);

  var average = sum / arr.length;
  return console.log(average);
}());