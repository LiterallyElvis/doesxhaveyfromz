var app = angular.module('doesxhaveyfromz');

app.controller('inquiryController', [
    '$scope', '$http', '$location',
    function($scope, $http, $location) {
      $scope.answerId = $location.absUrl().split('/')[4];
      if($scope.answerId.indexOf('?') > -1){ $scope.answerId = $scope.answerId.split('?')[0]}

      $http.get('/api/inquiry/' + $scope.answerId + '/answers').then(function(data){
        $scope.answers = data.data;

        $scope.x = $scope.answers[0].x
        $scope.y = $scope.answers[0].y
        $scope.z = $scope.answers[0].z
      })

      $scope.toggleText = "show examples ▶";
      // this could be a user-setting one day if I cared to do such a thing.
      $scope.showExamples = false;
      $scope.toggleExamples = function(){
        // ternary operators make me feel smart
        $scope.showExamples = $scope.showExamples ? false : true;
        $scope.toggleText = $scope.showExamples ? "hide examples ▼" : "show examples ▶";
      }

      // these functions look like a binary shart.
      $scope.userVotes = {};
      $scope.upvoteAnswer = function(answer){
        if( $scope.userVotes[answer.id] ){
          // user has already voted for this answer.
          if( $scope.userVotes[answer.id] != 1 ){
            $scope.userVotes[answer.id] = 1;
            answer.upvotes += 1;
            answer.downvotes -= 1;
          }
        } else {
          $scope.userVotes[answer.id] = 1;
          answer.upvotes += 1;
        }
      }

      $scope.downvoteAnswer = function(answer){
        if( $scope.userVotes[answer.id] ){
          // user has already voted for this answer.
          if( $scope.userVotes[answer.id] != -1 ){
            $scope.userVotes[answer.id] = -1;
            answer.upvotes -= 1;
            answer.downvotes += 1;
          }
        } else {
          $scope.userVotes[answer.id] = -1;
          answer.downvotes += 1;
        }
      }
    }
]);
