var app = angular.module('doesxhaveyfromz');

app.controller('inquiryController', [
    '$scope', '$http', '$location',
    function($scope, $http, $location) {
      $scope.answerId = $location.absUrl().split('/')[$location.absUrl().split('/').length - 1];

      $http.get('/api/inquiry/' + $scope.answerId + '/answers').then(function(data){
        $scope.answers = data.data;
      })


      $scope.exampleCode = "p { color: red; }";


      $scope.toggleText = "show examples ▶";
      $scope.showExamples = true;
      $scope.toggleExamples = function(){
        // ternary operators make me feel smart
        $scope.showExamples = $scope.showExamples ? false : true;
        $scope.toggleText = $scope.showExamples ? "hide examples ▼" : "show examples ▶";
      }

      // these functions look a binary mess.
      $scope.userVote = 0;
      $scope.upvoteAnswer = function(answer){
        console.log('upvoteAnswer called for answer: ' + answer.id);
        if( $scope.userVote === -1 ){
          $scope.userVote = 1;
          answer.upvotes += 1;
          answer.downvotes -= 1;
        } else if( $scope.userVote === 0 ){
          $scope.userVote = 1;
          answer.upvotes += 1;
        }
      }

      $scope.downvoteAnswer = function(answer){
        console.log('downvoteAnswer called for answer: ' + answer.id);
        if( $scope.userVote === 1 ){
          $scope.userVote = -1;
          answer.downvotes += 1;
          answer.upvotes -= 1;
        } else if( $scope.userVote === 0 ){
          $scope.userVote = -1;
          answer.downvotes -= 1;
        }
      }
    }
]);
