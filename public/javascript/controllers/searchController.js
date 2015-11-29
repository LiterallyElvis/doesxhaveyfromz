var app = angular.module('doesxhaveyfromz');

app.controller('searchController', [
    '$scope', '$http', '$location',
    function($scope, $http, $location) {

      var catchAll = 'anything';
      // this is bad and I should feel bad.
      var params = $location.absUrl().substr($location.absUrl().indexOf('/search?')+'/search?'.length).split('&').map(function(item){ return item.split('=')[1] })
      $scope.x = params[0] || catchAll;
      $scope.y = params[1] || catchAll;
      $scope.z = params[2] || catchAll;
      // every time someone like me does the above, a QA engineer's salary gets just *that* much higher.

      $scope.inquiries = [];
      $http.get('/api/search?x=' + $scope.x + '&y=' + $scope.y + '&z=' + $scope.z).then(function(data){
        $scope.inquiries = data.data;
      }, function(error) {
        console.log('An error occured:');
        console.log(error);
      })
    }
  ]
);