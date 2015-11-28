var app = angular.module('doesxhaveyfromz', []);

app.controller('headerController', [
    '$scope', '$http',
    function($scope, $http) {
      $http.get('/auth/logged_in').then(function(data){
        $scope.loggedIn = !!data.data.user;
        console.log("data:");
        console.log(data.data);
        console.log("loggedIn: " + $scope.loggedIn);
        if(data.data.user){
          $scope.user = data.data.user;
        }
      }, function(error){
        console.log("there was an error: " + error);
      })
    }
]);