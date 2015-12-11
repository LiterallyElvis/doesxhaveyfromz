var app = angular.module('doesxhaveyfromz');

app.controller('unansweredController', [
    '$scope', '$http', '$location', '$window',
    function($scope, $http) {

      $scope.inquiries = [];
      $http.get('/api/unanswered').then(function(data){
        $scope.inquiries = data.data;
      }, function(error) {
        console.log('An error occured retrieving unanswered inquiries');
      })
    }
  ]
);