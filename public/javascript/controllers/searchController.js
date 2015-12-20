var app = angular.module('doesxhaveyfromz');

app.controller('searchController', [
  '$scope', '$http', '$location', '$window',
  function($scope, $http, $location, $window) {
    var catchAlls = ['anything'];

    $scope.submitNewInquiry = function(){
      if( ( catchAlls.indexOf($scope.x.toLowerCase()) > -1 || $scope.x === '' ) ||
          ( catchAlls.indexOf($scope.y.toLowerCase()) > -1 || $scope.y === '' ) ||
          ( catchAlls.indexOf($scope.z.toLowerCase()) > -1 || $scope.z === '' ) ){
          $scope.invalidSubmissionError = true;
          $scope.invalidSubmissionNotice = "All values must be filled out and not 'anything.'";
      } else {
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
  }
]);