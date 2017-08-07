function concatCurrent(previousValue, currentValue) {
  return previousValue.concat(currentValue);
}


function flattening(array) {
  return array.reduce(concatCurrent);
}
