var app = angular.module('doesxhaveyfromz');

app.controller('indexController', [
    '$scope', '$http', '$interval', '$window',
    function($scope, $http, $interval, $window) {
        $scope.exampleX = 'Ruby';
        $scope.exampleY = '.get()';
        $scope.exampleZ = 'Python';

        var catchAll = 'anything';

        $scope.x = null;
        $scope.y = null;
        $scope.z = null;

        $scope.varsMarkedAny = [];
        $scope.warnAboutAny = false;

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
            '.lower()',
            '.join()',

            // JS stuff
            'two-way data binding',
            'callback functions',
            'reusable components'
        ];

        // $scope.autocompletes = [];
        // $http.get("/api/autocompletes").then(function(data){
        //     $scope.autocompletes = data.data;
        // }, function(error){
        //     console.log('Error retrieving autocompletes:');
        //     console.log(error);
        // }); // one day, not today.1

        function generateRandomNumberWithinRange(max, min) {
            if( !min ) { min = 0; }
            return Math.floor(Math.random() * (max - min) + min);
        };

        $scope.validateInput = function(varName, xyz){
            if( xyz.toLowerCase() === catchAll ){
                $scope.varsMarkedAny.push(varName);
                $scope.warnAboutAny = true;
                $scope.warningAboutAny = 'Be advised! The following variables are marked anything: ' + $scope.varsMarkedAny + '\nThis will result in all values being returned for the other variables.';
            } else {
                if( $scope.varsMarkedAny.indexOf(varName) != -1 ){ $scope.varsMarkedAny.splice($scope.varsMarkedAny.indexOf(varName), 1); };
                if( $scope.varsMarkedAny.length === 0 ){ $scope.warnAboutAny = false; };
                $scope.warningAboutAny = '';
            }
        }

        $scope.submitInquiry = function(){
            if( $scope.x.toLowerCase() === catchAll && $scope.y.toLowerCase() === catchAll && $scope.z.toLowerCase() === catchAll ){
                console.log('invalid query parameters');
                $scope.invalidQueryError = true;
                $scope.invalidQueryNotice = 'At least one value must be filled out and not \'anything\'.';
            } else {
                if( $scope.x === null ){ $scope.x = catchAll };
                if( $scope.y === null ){ $scope.y = catchAll };
                if( $scope.z === null ){ $scope.z = catchAll };

                $window.location.href = 'search?x=' + $scope.x + '&y=' + $scope.y + '&z=' + $scope.z
            }
        }

        $interval( function(){
            var xValue = generateRandomNumberWithinRange($scope.tools.length);
            var zValue = generateRandomNumberWithinRange($scope.tools.length);

            if( zValue === xValue ){ zValue = zValue == $scope.tools.length ? zValue - 1 : zValue + 1; }

            $scope.exampleX = $scope.tools[xValue];
            $scope.exampleY = $scope.features[generateRandomNumberWithinRange($scope.features.length)];
            $scope.exampleZ = $scope.tools[zValue];

        }, 3000);
    }
]);