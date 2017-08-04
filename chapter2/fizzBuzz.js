var fizzBuzz = function() {
  var i = 1,
    output = '';
  while (i <= 100) {
    if (!(i % 3)) {
      output += 'Fizz';
    } else if (!(i % 5)) {
      output += 'Buzz';
    }
    console.log(output || i);
    output = '';
    i++;
  }
}

fizzBuzz();
