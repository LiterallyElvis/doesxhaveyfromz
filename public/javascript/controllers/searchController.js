var app = angular.module('doesxhaveyfromz');

app.controller('searchController', [
  '$scope', '$http', '$location', '$window',
  function($scope, $http, $location, $window) {
    var catchAlls = ['anything'];
    var validParams = ['x', 'y', 'z'];
    $scope.params = {}

    $http.get('/auth/logged_in').then(function(data){
      $scope.loggedIn = !!data.data.user;
    }, function(error){
      console.log("there was an error checking if the user was logged in: " + error);
    });

    // this is bad and I should feel bad.
    $location.absUrl().substr($location.absUrl().indexOf('/search?')+'/search?'.length)
                      .split('&')
                      .map(function(item){
                        if( validParams.indexOf(item.split('=')[0]) > -1 ) {
                          $scope.params[item.split('=')[0]] = item.split('=')[1]
                        }
                      });
    // every time someone like me does the above, a QA engineer's salary gets *that* much higher.

    $scope.x = decodeURIComponent($scope.params['x']) || catchAlls[0];
    $scope.y = decodeURIComponent($scope.params['y']) || catchAlls[0];
    $scope.z = decodeURIComponent($scope.params['z']) || catchAlls[0];

    $scope.canSubmitInquiry = false;
    if( ( catchAlls.indexOf($scope.x.toLowerCase()) === -1 && $scope.x.trim() != '' ) &&
        ( catchAlls.indexOf($scope.y.toLowerCase()) === -1 && $scope.y.trim() != '' ) &&
        ( catchAlls.indexOf($scope.z.toLowerCase()) === -1 && $scope.z.trim() != '' ) ){
      $scope.canSubmitInquiry = true;
    }

    $scope.inquiries = [];
    $http.get('/api/search?x=' + $scope.x + '&y=' + $scope.y + '&z=' + $scope.z).then(function(data){
      $scope.inquiries = data.data;
      if( $scope.inquiries.length == 1 ){
        $window.location.href = '/inquiry/' + $scope.inquiries[0].id;
      }
    }, function(error) {
      console.log('An error occured: \n' + error);
    })

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