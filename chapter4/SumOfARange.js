/**
this function returns array of values from start to end and both inclusive.
**/
function range(start, end, step = 1) {
  if ((start > end && step > 0) || (start < end && step < 0) || (start === end))
    return [];
  var array = [],
    i = 0;
  while ((step > 0 && start <= end) || (step < 0 && start >= end)) {
    array[i] = start;
    start += step;
    i++;
  }
  return array;
}


function sum(array) {
  var sum = 0;
  for (var i in array) {
    sum += Number(array[i]);
  }
  return sum;
}


function tester() {
  console.log(sum(range(1, 10)));
}


tester();
