var app = angular.module('doesxhaveyfromz');

app.controller('inquiryController', [
    '$scope', '$http',
    function($scope, $http) {
      $scope.x = "Ruby"
      $scope.y = ".get()";
      $scope.z = "Python"
      $scope.acceptedAnswer = "Yes!";

      $scope.answers = [
        {
          content: "Ruby's version of .get is called .fetch(). It takes a similar set of parameters and behaves almost identically.",
          user: {
            name: "literallyelvis",
            photo: "https://avatars1.githubusercontent.com/u/1289344?v=3&s=460"
          },
          upvotes: 400,
          downvotes: 20
        },
        {
          content: "Ruby has no version of .get because it's better than Python, bleh!",
          user: {
            name: "relentlessjerk",
            photo: "http://conduit1.com/wp-content/uploads/blank-meme-021-scumbag-steve.jpg"
          },
          upvotes: 2,
          downvotes: 9001
        }
      ]
    }
]);