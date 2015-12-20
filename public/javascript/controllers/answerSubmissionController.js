var app = angular.module('doesxhaveyfromz');

app.controller('answerSubmissionController', [
  '$scope', '$http', '$interval', '$location', '$window',
  function($scope, $http, $interval, $location, $window) {
    $scope.characterLimit = 280;
    $scope.questionId = document.getElementsByName('inquiryId')[0].value;
    $scope.answerTypes = ['Yes', 'No', 'Kinda'];
    $scope.remainingCharacters = $scope.characterLimit;
    $scope.answerSubmission = {
      answer: null,
      summary: '',
      x_example: '',
      z_example: ''
    }
    $scope.submissionCanBeMade = false;
    $scope.expectExamples = false;
    $scope.invalidSubmissionError = false;

    $scope.countCharacters = function(){
      if( $scope.answerSubmission.summary ){
        $scope.remainingCharacters = $scope.characterLimit - $scope.answerSubmission.summary.length;
      }
      $scope.validateInput();
    }

    $scope.selectAnswerType = function(answer){ $scope.answerSubmission.answer = answer; $scope.validateInput() }
    $scope.validateInput = function(){
      if( $scope.answerSubmission.answer != null && $scope.answerSubmission.summary != null ){
        if( $scope.answerSubmission.answer.toLowerCase() === 'yes' &&
            $scope.answerSubmission.x_example.trim() != '' &&
            $scope.answerSubmission.z_example.trim() != '' &&
            $scope.answerSubmission.summary.trim() != ''){
          $scope.submissionCanBeMade = true;
        } else if( $scope.answerSubmission.answer.toLowerCase() !== 'yes' &&
                   $scope.answerSubmission.summary.trim() != '' ){
          $scope.submissionCanBeMade = true;
        } else {
          $scope.submissionCanBeMade = false;
        }
      } else {
        $scope.submissionCanBeMade = false;
      }
    }

    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };

    function escapeHtml(string) {
      return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
      });
    }

    $scope.submitNewAnswer = function(){
      if( $scope.submissionCanBeMade ){
        $scope.answerSubmission.summary = escapeHtml($scope.answerSubmission.summary);
        $scope.answerSubmission.x_example = escapeHtml($scope.answerSubmission.x_example);
        $scope.answerSubmission.z_example = escapeHtml($scope.answerSubmission.z_example);

        $scope.answerSubmission.answer = $scope.answerSubmission.answer.toLowerCase();

        $http.post('/api/submit_answer/' + $scope.questionId, $scope.answerSubmission)
        .then(function(result){
          $window.location.href = '/inquiry/' + $scope.questionId;
        }, function(error){
          console.log('an issue arose submitting your response: \n' + JSON.stringify(error, null, 4));
        })
      }
    }
  }
]);
