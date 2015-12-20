var app = angular.module('doesxhaveyfromz');

app.controller('searchController', [
  '$scope', '$http', '$window',
  function($scope, $http, $window) {
    var catchAlls = ['anything'];

    $scope.x = document.getElementsByName('x')[0].value;
    $scope.y = document.getElementsByName('y')[0].value;
    $scope.z = document.getElementsByName('z')[0].value;

    $scope.submitNewInquiry = function(){
      $http.post('/api/create_inquiry', { x: $scope.x, y: $scope.y, z: $scope.z }).then(
        function(data){
          $window.location.href = '/inquiry/' + data.data.post_id;
        }, function(error){
          $scope.invalidSubmissionError = true;
          $scope.invalidSubmissionNotice = 'Error submitting inquiry! It might already exist.'
          console.log('Error submitting inquiry: ' + JSON.stringify(error, null, 4));
        }
      )
    }
  }
]);