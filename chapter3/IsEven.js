function isEven(number) {
  if (number == 0)
    return true;
  else if (number == 1)
    return false;
  else {
    return (number > 0) ? isEven(number - 2) : isEven((-number));
  }
}
