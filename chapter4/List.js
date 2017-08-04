function arrayToList(array) {
  return ((array && (array.length - 1 >= 0)) ? generateList(array, array.length -
    1, null) : {});
}

function generateList(array, index, list) {
  if (index < 0) {
    return list;
  }
  var node = {
    value: array[index],
    rest: list
  };
  return generateList(array, index - 1, node);
}


function listToArray(list) {
  var array = [],
    index = 0;
  while (list) {
    array[index] = list.value;
    list = list.rest;
    index++;
  }
  return array;
}


function prepend(item, list) {
  return {
    value: item,
    rest: list
  };
}

function nth(position, list) {
  if (position === 0) {
    return (list) ? list.value : undefined;
  }
  return nth(position - 1, list.rest);
}
