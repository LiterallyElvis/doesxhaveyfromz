var app = angular.module('doesxhaveyfromz');

app.controller('answerSubmissionController', [
    '$scope', '$http', '$interval', '$location', '$window',
    function($scope, $http, $interval, $location, $window) {
      $scope.characterLimit = 280;
      $scope.questionId = $location.absUrl().split('/')[4];
      if($scope.questionId.indexOf('?') > -1){ $scope.questionId = $scope.questionId.split('?')[0] }

      $http.get('/auth/logged_in').then(function(data){
        $scope.loggedIn = !!data.data.user;
        if(data.data.user){
          $scope.user = data.data.user;
        } else { /* $window.location.href = '/'; */ }
      }, function(error){
        console.log("there was an error checking if the user was logged in: " + error);
      })

      $http.get('/api/inquiry/' + $scope.questionId).then(function(data){
        $scope.inquiry = data.data[0];
      });

      $scope.answerSubmission = {
        answer: null,
        summary: null,
        x_example: null,
        z_example: null
      }

      $scope.answerTypes = ['yes', 'no', 'kinda'];
      $scope.remainingCharacters = $scope.characterLimit;

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
              $scope.answerSubmission.z_example.trim() != '' ){
            $scope.submissionCanBeMade = true;
          } else if( $scope.answerSubmission.answer.toLowerCase() !== 'yes' ){
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

          $http.post('/api/submit_answer/' + $scope.questionId, $scope.answerSubmission)
          .then(function(result){
            $window.location.href = '/inquiry/' + $scope.questionId;
          }, function(error){
            console.log('an issue arose submitting your response: \n' + JSON.stringify(error, null, 4));
          })
        }
      }
    }
  ]
);
