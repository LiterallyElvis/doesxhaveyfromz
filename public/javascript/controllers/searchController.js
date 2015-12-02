var app = angular.module('doesxhaveyfromz');

app.controller('searchController', [
    '$scope', '$http', '$location',
    function($scope, $http, $location) {
      var catchAll = ['anything'];
      var validParams = ['x', 'y', 'z'];
      $scope.params = {}

      // this is bad and I should feel bad.
      $location.absUrl().substr($location.absUrl().indexOf('/search?')+'/search?'.length)
                        .split('&')
                        .map( function(item){
                          if( validParams.indexOf(item.split('=')[0]) > -1 ) {
                            $scope.params[item.split('=')[0]] = item.split('=')[1]
                          }
                        });
      // every time someone like me does the above, a QA engineer's salary gets *that* much higher.

      $scope.x = $scope.params['x'] || catchAll[0];
      $scope.y = $scope.params['y'] || catchAll[0];
      $scope.z = $scope.params['z'] || catchAll[0];

      $scope.inquiries = [];
      $http.get('/api/search?x=' + $scope.x + '&y=' + $scope.y + '&z=' + $scope.z).then(function(data){
        $scope.inquiries = data.data;
        console.log('$scope.inquiries');
        console.log($scope.inquiries);
      }, function(error) {
        console.log('An error occured:');
        console.log(error);
      })
    }
  ]
);