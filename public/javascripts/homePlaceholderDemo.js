var tools = [
  // languages
  'Javascript', 
  'Go',         // <- personal fav <3
  'Python',
  'Ruby',
  'Swift',
  'C',
  'C++',
  'Clojure',
  'Java',
  'Haskell',
  'Lisp',

  // JS frameworks
  'Backbone',
  'Angular',
  'React',

  // Python frameworks.
  'Django',
  'Flask',

  // Databases
  'Postgres',
  'Redis',
  'Mongo',

  // Markup/CSS preprocessors
  'Sass',
  'Jade', 
  'Less',
  'Haml'
]

var features = [
  // general programming language things
  'duck typing',
  'static typing',
  'structs',
  'constants',

  // generic functions found in many languages
  '.split()',
  '.map()',
  '.min()',
  '.max()',
  '.sqrt()',

  // birds of many names
  'anonymous functions',
  'lambda functions',
  'function literals',

  // personal favorite python things.
  '.get()',
  'continue',
  '.update()',

  // common string operations
  '.strip()',
  '.trim()',
  'template strings',

  // JS stuff
  'two-way data binding',
  'callback functions',
  'reusable components'
]

function generateRandomNumberWithinRange(max, min){
  if( !min ){
    min = 0;
  }
  return Math.floor(Math.random() * (max - min) + min);
}

setInterval(function(){ 
  var x = document.getElementById("x");
  var y = document.getElementById("y");
  var z = document.getElementById("z");

  var xValue = generateRandomNumberWithinRange(tools.length);
  var zValue = generateRandomNumberWithinRange(tools.length);

  if( zValue === xValue ){
     zValue = zValue == tools.length ? zValue - 1 : zValue + 1
  }

  x.placeholder = tools[xValue];
  y.placeholder = features[generateRandomNumberWithinRange(features.length)];
  z.placeholder = tools[zValue];

}, 3000);