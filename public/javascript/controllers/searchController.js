var app = angular.module('doesxhaveyfromz');

app.controller('searchController', [
    '$scope', '$http', '$location', '$window',
    function($scope, $http, $location, $window) {
      var catchAlls = ['anything'];
      var validParams = ['x', 'y', 'z'];
      $scope.params = {}

      // this is bad and I should feel bad.
      $location.absUrl().substr($location.absUrl().indexOf('/search?')+'/search?'.length)
                        .split('&')
                        .map(function(item){
                          if( validParams.indexOf(item.split('=')[0]) > -1 ) {
                            $scope.params[item.split('=')[0]] = item.split('=')[1]
                          }
                        });
      // every time someone like me does the above, a QA engineer's salary gets *that* much higher.

      $scope.x = $scope.params['x'] || catchAlls[0];
      $scope.y = $scope.params['y'] || catchAlls[0];
      $scope.z = $scope.params['z'] || catchAlls[0];

      $scope.submitUrl = 'submit?x=' + $scope.x + '&y=' + $scope.y + '&z=' + $scope.z;

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