function average(array) {
  var totalYeays = array.reduce((a, b) => {
    return a + b;
  });
  return totalYeays / array.length;
}


function groupBy(data) {
  var agesPerCentury = {},
    member, century;
  for (member of data) {
    century = Math.ceil(member.died / 100);
    if (!agesPerCentury[century]) {
      agesPerCentury[century] = [];
    }
    agesPerCentury[century].push(member.died - member.born);
  }
  return agesPerCentury;
}

function historicalLifeExpectancy(data) {
  var agesPerCentury = groupBy(data);
  for (var prop in agesPerCentury) {
    agesPerCentury[prop] = average(agesPerCentury[prop]);
  }

  return agesPerCentury;
}
