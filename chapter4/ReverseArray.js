/**
This function returns a new array with the values of given array in reverse order.
**/
function reverseArray(array) {
  var newArray = [];
  if (array) {
    for (var i = array.length - 1; i >= 0; i--) {
      newArray[array.length - i - 1] = array[i];
    }
  }
  return newArray;
}

/**
This function returns same array by reversing the values of the array in place.
**/
function reverseArrayInPlace(array) {
  if (array) {
    var temp;
    for (var i = 0; i < Math.floor(array.length / 2); i++) {
      temp = array[i];
      array[i] = array[array.length - i - 1];
      array[array.length - i - 1] = temp;
    }
  }
}
