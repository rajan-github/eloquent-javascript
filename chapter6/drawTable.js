var MOUNTAINS = require('./mountains');

function rowHeights(rows) {
  return rows.map(function(row) {
    return row.reduce(function(max, cell) {
      return Math.max(max, cell.minHeight());
    }, 0);
  });
}

/**
this function returns an array of
mimimum widths of each column which is
calculated by traversing over all the rows
 and choosing the widest column.
**/
function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth())
    }, 0)
  });
}

function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

  function drawLine(blocks, lineNo) {
    return blocks.map(function(block) {
      return block[lineNo];
    }).join(" ");
  }

  function drawRow(row, rowNum) {
    var blocks = row.map(function(cell, colNum) {
      return cell.draw(widths[colNum], heights[rowNum]);
    });

    return blocks[0].map(function(_, lineNo) {
      return drawLine(blocks, lineNo);
    }).join("\n");
  }

  return rows.map(drawRow).join("\n");
}


function repeat(string, times) {
  var result = '';
  for (var i = 0; i < times; i++) {
    result += string;
  }
  return result;
}

function TextCell(text) {
  this.text = text.split('\n');
}

TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};

TextCell.prototype.minHeight = function() {
  return this.text.length;
}

TextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    //append line to fill the empty space
    result.push(line + repeat(" ", width - line.length));
  }
  return result;
}


function UnderlinedCell(inner) {
  this.inner = inner;
}

UnderlinedCell.prototype.minWidth = function() {
  return this.inner.minWidth();
}

UnderlinedCell.prototype.minHeight = function() {
  return this.inner.minHeight() + 1;
}

UnderlinedCell.prototype.draw = function(width, height) {
  console.log("Calling from UnderlinedCell draw: " + width + ' -- ' + height);
  return this.inner.draw(width, height - 1).concat([repeat("-", width)]);
}

/**
this function takes array of row objects and creates
the grid which then can be drawn using the drawTable.
**/
function dataTable(data) {
  var keys = Object.keys(data[0]);
  var headers = keys.map(function(name) {
    return new UnderlinedCell(new TextCell(name));
  });
  var body = data.map(function(row) {
    return keys.map(function(name) {
      return new TextCell(String(row[name]));
    });
  });
  return [headers].concat(body);
}

//sample testing of the program
var rows = [];
for (var i = 0; i < 5; i++) {
  var row = [];
  for (var j = 0; j < 5; j++) {
    if ((j + i) % 2 == 0)
      row.push(new TextCell("##"))
    else
      row.push(new TextCell("  "))
  }
  rows.push(row);
}



console.log(drawTable(dataTable(MOUNTAINS)));
