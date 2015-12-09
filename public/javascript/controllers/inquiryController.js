var app = angular.module('doesxhaveyfromz');

app.controller('inquiryController', [
    '$scope', '$http', '$location',
    function($scope, $http, $location, ngDialog) {
      $scope.inquiryId = $location.absUrl().split('/')[4];
      if($scope.inquiryId.indexOf('?') > -1){ $scope.inquiryId = $scope.inquiryId.split('?')[0]}

      $scope.inquiryInfoLoaded = false;
      $http.get('/api/inquiry/' + $scope.inquiryId).then(function(data){
        $scope.inquiryInfo = data.data[0];
        $scope.inquiryInfoLoaded = true;
        $scope.inquiryInfo.x = decodeURI($scope.inquiryInfo.x);
        $scope.inquiryInfo.y = decodeURI($scope.inquiryInfo.y);
        $scope.inquiryInfo.z = decodeURI($scope.inquiryInfo.z);
      });

      $http.get('/api/inquiry/' + $scope.inquiryId + '/answers').then(function(data){
        $scope.answers = data.data;
        $scope.answers.forEach(function(answer){
          if( answer.x_example != null && answer.z_example != null ){
            answer['pageExamples'] = {show: false, text: "show examples ▶"};
          }
        });
        $scope.answers.sort(function(x, y){
          if( x.upvotes > y.upvotes ){ return -1; }
          if( x.upvotes < y.upvotes ){ return  1; }
          return 0;
        })
      });

      $http.get('/auth/logged_in').then(function(data){
        $scope.loggedIn = !!data.data.user;
        if(data.data.user){
          $scope.user = data.data.user;
        }
      }, function(error){
        console.log("there was an error checking if the user was logged in: " + error);
      });

      // this could be a user-setting one day if I cared to do such a thing.
      $scope.toggleExamplesFor = function(answer){
        if( answer.pageExamples.show === true ){
          answer['pageExamples'] = {show: false, text: "show examples ▶"};
        } else {
          answer['pageExamples'] = {show: true, text: "hide examples ▼"};
        }
      }

      $scope.userReports = {};
      $scope.reportAnswer = function(answer){
        $scope.userReports[answer.id] = true;
        $http.post('/api/vote/unproductive/' + answer.id, {})
          .then(function(res){},
                function(err){
                  console.log('error reporting answer: ' + err);
                }
          );
      }

      $scope.userHasReportedAnswer = function(answer){
        return Object.keys($scope.userReports).indexOf(String(answer.id)) > -1;
      }

      $scope.userVotes = {};
      // these functions look like a binary shart.
      $scope.upvoteAnswer = function(answer){
        $http.post('/api/vote/up/' + answer.id, {})
        .then(function(success){
          if( $scope.userVotes[answer.id] ){
            // user has already voted for this answer.
            if( $scope.userVotes[answer.id] != 1 ){
              $scope.userVotes[answer.id] = 1;
              answer.upvotes += 1;
              answer.downvotes -= 1;
            }
          } else {
            $scope.userVotes[answer.id] = 1;
            answer.upvotes += 1;
          }
        }, function(error){
          console.log('an error occurred when upvoting: ' + error);
        });
      }

      $scope.downvoteAnswer = function(answer){
        $http.post('/api/vote/down/' + answer.id, {})
        .then(function(success){
          if( $scope.userVotes[answer.id] ){
            // user has already voted for this answer.
            if( $scope.userVotes[answer.id] != -1 ){
              $scope.userVotes[answer.id] = -1;
              answer.upvotes -= 1;
              answer.downvotes += 1;
            }
          } else {
            $scope.userVotes[answer.id] = -1;
            answer.downvotes += 1;
          }
        }, function(error){
          console.log('an error occurred when downvoting: ' + error);
        });
      }
    }
]);
