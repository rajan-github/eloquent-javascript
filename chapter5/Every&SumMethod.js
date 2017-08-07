/**
this method returns AND of items and calculates true/false using the given predicate.
This method behaves like shorcircuited AND operation.
**/
function every(array, predicate) {
  var valueSoFar = true,
    itemInArray;
  for (itemInArray of array) {
    if (!predicate(itemInArray)) {
      valueSoFar = false;
      break;
    }
  }
  return valueSoFar;
}


/**
this method returns OR of items and calculates true/false using the given predicate.
This method behaves like shorcircuited OR operation.
**/
function some(array, predicate) {
  var valueSoFar = false,
    itemInArray;
  for (itemInArray of array) {
    if (predicate(itemInArray)) {
      valueSoFar = true;
      break;
    }
  }
  return valueSoFar;
}
