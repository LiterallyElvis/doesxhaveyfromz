var app = angular.module('doesxhaveyfromz');

app.controller('inquiryController', [
    '$scope', '$http', '$location',
    function($scope, $http, $location) {
      $scope.answerId = $location.absUrl().split('/')[$location.absUrl().split('/').length - 1];

      $http.get('/api/inquiry/' + $scope.answerId + '/answers').then(function(data){
        $scope.answers = data.data;
      })

      $scope.upvoteAnswer = function(id){
        console.log('upvoteAnswer called for answer: ' + id);
      }

      $scope.downvoteAnswer = function(id){
        console.log('downvoteAnswer called for answer: ' + id);
      }
    }
]);
