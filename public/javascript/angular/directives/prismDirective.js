// found this directive on the ol' Overflow:
// http://stackoverflow.com/questions/22742899/using-prismjs-in-angular-app

app.directive('prism', ['$compile', function($compile) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
          source: '@'
        },
        link: function(scope, element, attrs, controller, transclude) {
            scope.$watch('source', function(v) {
              element.find("code").html(v);

              // Prism.highlightElement(element.find("code")[0]);
            });

            transclude(function(clone) {
              if (clone.html() !== undefined) {
                element.find("code").html(clone.html());
                $compile(element.contents())(scope.$parent);
              }
            });
        },
        template: "<code></code>"
    };
}]);