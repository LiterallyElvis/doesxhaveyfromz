var app = angular.module('doesxhaveyfromz');

app.controller('inquiryController', [
  '$scope', '$http', '$location',
  function($scope, $http, $location, ngDialog) {
    $scope.userReports = {};
    $scope.reportAnswer = function(answerId){
      $scope.userReports[answerId] = true;
      $http.post('/api/vote/unproductive/' + answerId, {})
        .then(function(success){}, function(err){
          console.log('error reporting answer: ' + err);
        });
    }

    $scope.userHasReportedAnswer = function(answerId){
      return Object.keys($scope.userReports).indexOf(String(answerId)) > -1;
    }

    $scope.userVotes = {};
    // these functions look like a binary shart.
    $scope.upvoteAnswer = function(answerId){
      $http.post('/api/vote/up/' + answerId, {})
      .then(function(success){
        if( $scope.userVotes[answerId] ){
          // user has already voted for this answer.
          if( $scope.userVotes[answerId] != 1 ){
            $scope.userVotes[answerId] = 1;
          }
        } else {
          $scope.userVotes[answerId] = 1;
        }
      }, function(error){
        console.log('an error occurred when upvoting: ' + error);
      });
    }

    $scope.downvoteAnswer = function(answer){
      $http.post('/api/vote/down/' + answerId, {})
      .then(function(success){
        if( $scope.userVotes[answerId] ){
          // user has already voted for this answer.
          if( $scope.userVotes[answerId] != -1 ){
            $scope.userVotes[answerId] = -1;
          }
        } else {
          $scope.userVotes[answerId] = -1;
        }
      }, function(error){
        console.log('an error occurred when downvoting: ' + error);
      });
    }
  }
]);
