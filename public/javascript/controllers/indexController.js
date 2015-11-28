var app = angular.module('doesxhaveyfromz', []);

app.controller('indexController', [
    '$scope', '$http', '$interval',
    function($scope, $http, $interval) {
        $scope.x = "Ruby";
        $scope.y = ".get()";
        $scope.z = "Python";
        
        $scope.tools = [
            // languages
            'Javascript',
            'Go', // <- personal fav <3
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

            // databases
            'Postgres',
            'Redis',
            'Mongo',

            // markup/CSS preprocessors
            'Sass',
            'Jade',
            'Less',
            'Haml'
        ];

        $scope.features = [
            // general programming language things
            'duck typing',
            'static typing',
            'structs',
            'constants',
            'decorators',
            'template strings',

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
            '.split()',

            // JS stuff
            'two-way data binding',
            'callback functions',
            'reusable components'
        ];

        $scope.autocompletes = {
            x: [],
            y: [],
            z: []
        };
        $http.get("/api/autocompletes").then(function(data){
            data.data.forEach(function(group){ 
                for(var thing in group){ $scope.autocompletes[thing].push(group[thing]);}
            });
        }, function(error){
            console.log("Error retrieveing autocompletes:");
            console.log(error);
        });

        function generateRandomNumberWithinRange(max, min) {
            if (!min) { min = 0; }
            return Math.floor(Math.random() * (max - min) + min);
        };
        
        $interval( function(){         
            var xValue = generateRandomNumberWithinRange($scope.tools.length);
            var zValue = generateRandomNumberWithinRange($scope.tools.length);

            if (zValue === xValue) {
                zValue = zValue == $scope.tools.length ? zValue - 1 : zValue + 1
            }

            $scope.x = $scope.tools[xValue];
            $scope.y = $scope.features[generateRandomNumberWithinRange($scope.features.length)];
            $scope.z = $scope.tools[zValue];

        }, 3000);
    }
]);