function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(vector) => {
  return new Vector(this.x + vector.x, this.y + vector.y);
}

Vector.prototype.minus = function(vector) => {
  return new Vector(this.x + vector.x, this.y - vector.y);
}

Vector.prototype.length = function() => {
  return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.print = function() => {
  console.log('(' + this.x + ', ' + this.y + ')');
}

function testVector() {
  const vector1 = new Vector(3, 4);
  const vector2 = new Vector(5, 6);
  const sum = vector1.plus(vector2);
  const sub = vector1.minus(vector2);
  sum.print();
  sub.print();
}

testVector();
