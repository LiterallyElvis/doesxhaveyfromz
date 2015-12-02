var app = angular.module('doesxhaveyfromz');

app.controller('unansweredController', [
    '$scope', '$http', '$location', '$window',
    function($scope, $http, $location, $window) {
      var catchAlls = ['anything'];

      $scope.inquiries = [];
      $http.get('/api/unanswered').then(function(data){
        $scope.inquiries = data.data;
        console.log(JSON.stringify($scope.inquiries, null, 4));
      }, function(error) {
        console.log('An error occured retrieving unanswered inquiries');
      })
    }
  ]
);