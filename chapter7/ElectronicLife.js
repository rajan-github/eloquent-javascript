/**
This array is plan which is used to fill the grid.
Our world would be laid out with one character per square.
*/
var plan = ["############################",
  "#      #    #      o      ##",
  "#                          #",
  "#          #####           #",
  "##         #   #    ##     #",
  "###           ##     #     #",
  "#           ###      #     #",
  "#   ####                   #",
  "#   ##       o             #",
  "# o  #         o       ### #",
  "#    #                     #",
  "############################"
];


/**
To point one particular square we use coordinate system(x,y) and we
 define following Vector which has one method plus which
  adds two vector and returns new one.
*/
function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
}


/**
Grid is represented as a single diementional
array of size width*height. And to find one
element at (x,y) we just look at (x+y*width).
*/
function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}

/**
This method takes a position(in form of vector of course)
and tells whether this position is inside the grid or not.
*/
Grid.prototype.isInside = function(vector) {
  return vector.x >= 0 && vector.x < this.width && vector.y >= 0 && vector.y <
    this.height;
}


/**
This method returns the element present at given location.
*/
Grid.prototype.get = function(vector) {
  return this.space[vector.x + vector.y * this.width]
}


/**
This method sets the given element at given location.
*/
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + vector.y * this.width] = value;
}


/**
These are all directions surrounding the critter.
A critter can move in any one of them if that place is empty.
*/
var directions = {
  "n": new Vector(0, -1),
  "ne": new Vector(1, -1),
  "e": new Vector(1, 0),
  "se": new Vector(1, 1),
  "s": new Vector(0, 1),
  "sw": new Vector(-1, 1),
  "w": new Vector(-1, 0),
  "nw": new Vector(-1, -1)
};

/**
This function returns the random element from the given array.
*/
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
This variable stores the directions array of all directions.
*/
var directionNames = "n ne e se s sw w nw".split(" ");


/**
This critter has direction stored in it.
*/
function BouncingCritter() {
  this.direction = randomElement(directionNames);
}

/**
Act method takes view object which has
look, find, findAll methods to find directions.
Act method finds the empty direction where critter can move
and returns action object. If no direction is found it returns s(south).
*/
BouncingCritter.prototype.act = function(view) {
  if (view.look(this.direction) != " ")
    this.direction = view.find(" ") || "s";
  return {
    type: "move",
    direction: this.direction
  };
}

/**
First we create an instance of the right type by looking
up the character's constructor and applying new to it.
*/
function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

/**
This object represents world. Here map is an array
of strings like we already defined plan. And character from
these strings are used to fill our grid.
Example of legend object
is {"#": Wall ,"o ": BouncingCritter }.
*/
function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;
  map.forEach(function(line, y) {
    for (var x = 0; x < line.length; x++) {
      this.grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
    }
  }, this);
}


/**
This function is symetric to the elementFromChar function.
This function accepts element and returns char of this element.
We store element in grid in the form of object(like Wall, BouncingCritter defined)
not just simple strings. So to get the original string we use this charFromElement function.
*/
function charFromElement(element) {
  if (element == null)
    return " ";
  else return element.originChar;
}

/**
This method converts grid from array to a
string which could printed to show what is
going on in world.
*/
World.prototype.toString = function() {
  var output = "";
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
}

/**
This is simple object to take space and it doesn't have any act method.
*/
function Wall() {

}


Grid.prototype.forEach = function(f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null) {
        f.call(context, value, new Vector(x, y));
      }
    }
  }
}

/**
This function call letAct which actually takes
action according to the critter action.
*/
World.prototype.turn = function() {
  var acted = [];
  this.grid.forEach(function(critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
}

/**
This is main logic which moves the critter to
new location after veryfing that location. It takes critter and vector of the critter.
*/
World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type === 'move') {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
}


/**
This function checks takes action and vector.
It then calculates the new destination with respect
to given vector in grid if it is inside. If it is inside
it then returns that dest otherwise returns nothing.
*/
World.prototype.checkDestination = function(action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest))
      return dest;
  }
}

/**
This constructor view is helpful in looking some position in the world.
It provides methods like look, find, findAll which are defined below.
*/
function View(world, vector) {
  this.world = world;
  this.vector = vector;
}


/**
This function takes dir object and
looks up in the world and returns the element
present at that position otherwise returns # symbol of wall.
*/
View.prototype.look = function(dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target))
    return charFromElement(this.world.grid.get(target));
  return "#";
}

/**
This function takes a character as input and
returns an array of all those positions which have this character.
*/
View.prototype.findAll = function(ch) {
  var found = [];
  for (var dir in directions) {
    if (this.look(dir) == ch) {
      found.push(dir);
    }
  }
  return found;
}


/**
This function randomly looks all the positions which has this given character.
This function calls findAll function internally.
*/
View.prototype.find = function(ch) {
  var found = this.findAll(ch);
  if (found)
    return randomElement(found);
  return null;
}


function dirPlus(dir, n) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

function WallFollower() {
  this.dir = "s";
}

WallFollower.prototype.act = function(view) {
  var start = this.dir;
  if (view.look(dirPlus(this.dir, -3)) != " ")
    start = this.dir = dirPlus(this.dir, -2);
  while (view.look(this.dir) != " ") {
    this.dir = dirPlus(this.dir, 1);
    if (this.dir == start) break;
  }
  return {
    type: " move ",
    direction: this.dir
  };
};



function LifelikeWorld(map, legend) {
  World.call(this, map, legend);
}

LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action && action.type in actionTypes && actionTypes[action.type]
    .call(this, critter, vector, action);
  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0)
      this.grid.set(vector, null);
  }
}


/**
If critter grow its energy is increased by 0.5 unit.
*/
actionTypes.grow = function(critter) {
  critter.energy += 0.5;
  return true;
}

/**
Critter can move if it has energy
level more than 1 and dest is not null or dest
is empty place for critter to take. It return true if critter
moves successfully otherwise returns false. In move operation energy level decreases by 1 unit.
*/
actionTypes.move = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  if (dest == null || critter.energy <= 1 || this.grid.get(dest) != null)
    return false;
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
}

/**
Critter eats another critter by first finding the destination and then taking item from that position.
After taking element from destination it checks if target element is edible by checking if it has any energy.
Once critter eats another item its enery is increased by prey's energy.
*/
actionTypes.eat = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest && this.grid.get(dest);
  if (!atDest || !atDest.energy) {
    return false;
  }
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
}

/**
This action reproduce the new critter. To reproduce a parent critter
needs to have double of energy of baby critter. If it has then it would reproduce
and its energy would reduce by double of energy of baby critter.
*/
actionTypes.reproduce = function(critter, vector, action) {
  var baby = elementFromChar(this.legend, critter.originChar);
  var dest = checkDestination(action, vector);
  if (!dest || critter.energy <= 2 * baby.energy || this.grid.get(dest))
    return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
}

/**
Plant starts its life between 3 and 7.
*/
function Plant() {
  this.energy = 3 + Math.random() * 4;
}

/**
Plants can reproduce and grow. If energy is more than 15 units and
space is available they reproduce. If energy is less than 20 units then they grow.
For growing they don't need space.
*/
Plant.prototype.act = function(view) {
  if (this.energy > 15) {
    var space = view.find(" ");
    if (space)
      return {
        type: "reproduce",
        direction: space
      }
  }
  if (this.energy < 20)
    return {
      type: "grow"
    };
}

/**
PlantEater has constant energy of 20 unit when first it is created.
*/
function PlantEater() {
  this.energy = 20;
}

/**
PlantEater can reproduce, eat, and move. If energy is greater
than 60 unit and space is available then they reproduce, or if they have plant around
then they eat the plant and if space is available they move.
*/
PlantEater.prototype.act = function(view) {
  var space = view.find(" ");
  if (this.energy > 60 && space)
    return {
      action: "reproduce",
      direction: space
    };
  var plant = view.find("*");
  if (plant) {
    return {
      type: "eat",
      direction: plant
    };
  }
  if (space)
    return {
      type: "move",
      direction: space
    };
}


/**
Creating a new worold with new plan and new legend object.
*/
var valley = new LifelikeWorld(
  ["############################",
    "#####                 ######",
    "##   ***                **##",
    "#   *##**         **  O  *##",
    "#    ***     O    ##**    *#",
    "#       O         ##***    #",
    "#                 ##**     #",
    "#   O       #*             #",
    "#*          #**       O    #",
    "#***        ##**    O    **#",
    "##****     ###***       *###",
    "############################"
  ], {
    "#": Wall,
    "O": PlantEater,
    "*": Plant
  }
);


var world = new World(plan, {
  "#": Wall,
  "o": BouncingCritter
});


for (var i = 0; i < 5; i++) {
  valley.turn();
  console.log(valley.toString());
}
