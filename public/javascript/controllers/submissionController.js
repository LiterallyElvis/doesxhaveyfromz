var app = angular.module('doesxhaveyfromz');

app.controller('submissionController', [
    // lol this controller has the most dystopian name.
    '$scope', '$http', '$interval', '$location', '$window',
    function($scope, $http, $interval, $location, $window) {
        var catchAlls = ['anything'];
        var validParams = ['x', 'y', 'z'];
        $scope.params = {}

        // this is bad and I should feel bad.
        $location.absUrl().substr($location.absUrl().indexOf('/submit?')+'/submit?'.length)
                        .split('&')
                        .map(function(item){
                          if( validParams.indexOf(item.split('=')[0]) > -1 ) {
                            $scope.params[item.split('=')[0]] = item.split('=')[1]
                          }
                        });
        // every time someone like me does the above, a QA engineer's salary gets *that* much higher.

        $scope.x = '';
        $scope.y = '';
        $scope.z = '';

        for( var param in $scope.params ){
            console.log('$scope.params.' + param + ' = ' + $scope.params[param]);
            if( catchAlls.indexOf(String($scope.params[param]).toLowerCase()) === -1 ){
                $scope[param] = $scope.params[param];
            }
        }

        $scope.varsMarkedAny = [];
        $scope.warnAboutAny = false;
        $scope.invalidSubmissionError = false;

        $scope.validateInput = function(varName, xyz){
            if( catchAlls.indexOf(xyz.toLowerCase()) > -1 ){
                $scope.varsMarkedAny.push(varName);
                $scope.warnAboutAny = true;
                $scope.warningAboutAny = 'Be advised! The following variables are marked anything: ' + $scope.varsMarkedAny + "\nYou can't submit queries containing 'any' variables.";
            } else {
                if( $scope.varsMarkedAny.indexOf(varName) != -1 ){ $scope.varsMarkedAny.splice($scope.varsMarkedAny.indexOf(varName), 1); };
                if( $scope.varsMarkedAny.length === 0 ){ $scope.warnAboutAny = false; $scope.invalidSubmissionError = false; };
                $scope.warningAboutAny = '';
            }
        }

        $scope.submitNewInquiry = function(){
            console.log('submitNewInquiry called.');
            if( ( catchAlls.indexOf($scope.x.toLowerCase()) > -1 || $scope.x === '' ) &&
                ( catchAlls.indexOf($scope.y.toLowerCase()) > -1 || $scope.y === '' ) &&
                ( catchAlls.indexOf($scope.z.toLowerCase()) > -1 || $scope.z === '' ) ){
                $scope.invalidSubmissionError = true;
                $scope.invalidSubmissionNotice = 'At least one value must be filled out and not \'anything\'.';
            } else {
                if( $scope.x === '' ){ $scope.x = catchAlls[0] };
                if( $scope.y === '' ){ $scope.y = catchAlls[0] };
                if( $scope.z === '' ){ $scope.z = catchAlls[0] };

                // $window.location.href = 'search?x=' + $scope.x + '&y=' + $scope.y + '&z=' + $scope.z;
            }
        }
    }
]);
