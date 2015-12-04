var app = angular.module('doesxhaveyfromz');

app.controller('answerSubmissionController', [
    // lol this controller has the most dystopian name.
    '$scope', '$http', '$interval', '$location', '$window',
    function($scope, $http, $interval, $location, $window) {
      var catchAlls = ['anything'];

      var questionId = $location.absUrl().split('/');

      $scope.answerTypes = ['yes', 'no', 'kinda'];
      $scope.answerType = null;

      $scope.varsMarkedAny = [];
      $scope.warnAboutAny = false;
      $scope.invalidSubmissionError = false;

      $scope.selectAnswerType = function(answer){
        $scope.answerType = answer;
      }

      $scope.validateInput = function(){}

      $scope.submitNewAnswer = function(){}
    }
]);
