var chessBoard = function() {
  var height = 16,
    width = 16,
    string = '';
  for (var i = 1; i <= height; i++) {
    for (var k = 0; k < width; k++) {
      if (!(i % 2) && !(k % 2))
        string += '#';
      else if ((i % 2) && (k % 2))
        string += '#';
      else
        string += ' ';
    }
    string += '\n';
  }
  console.log(string);
}

chessBoard();
