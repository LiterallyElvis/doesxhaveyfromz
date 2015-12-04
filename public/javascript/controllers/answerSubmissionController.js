var app = angular.module('doesxhaveyfromz');

app.controller('answerSubmissionController', [
    // lol this controller has the most dystopian name.
    '$scope', '$http', '$interval', '$location', '$window',
    function($scope, $http, $interval, $location, $window) {
      var catchAlls = ['anything'];

      var questionId = $location.absUrl().split('/');
      console.log(questionId);

      $scope.answerTypes = ['yes', 'no', 'kinda'];

      // $scope.answerTypes = [
      //   { id: 'yes', name: 'yes' },
      //   { id: 'no', name: 'no' },
      //   { id: 'kinda', name: 'kinda' }
      // ];
      $scope.answerType = null;

      $scope.varsMarkedAny = [];
      $scope.warnAboutAny = false;
      $scope.invalidSubmissionError = false;

      $scope.selectAnswerType = function(answer){
        $scope.answer = answer;
        console.log($scope.answer);
      }

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

      $scope.submitNewAnswer = function(){
        if( ( catchAlls.indexOf($scope.x.toLowerCase()) > -1 || $scope.x === '' ) ||
            ( catchAlls.indexOf($scope.y.toLowerCase()) > -1 || $scope.y === '' ) ||
            ( catchAlls.indexOf($scope.z.toLowerCase()) > -1 || $scope.z === '' ) ){
            $scope.invalidSubmissionError = true;
            $scope.invalidSubmissionNotice = 'All values must be filled out and not \'anything\'.';
        } else {
          $http.post('/api/create_inquiry', { x: $scope.x, y: $scope.y, z: $scope.z }).then(
            function(data){
              console.log('post successful')
              console.log(data.data);
            }, function(error){
               console.log('Error submitting inquiry: ' + JSON.stringify(error, null, 4));
            }
          )
        }
      }
    }
]);
