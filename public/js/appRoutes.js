/**
 * Created by damon on 14/11/2.
 */

angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // Post page
        .when('/post', {
            templateUrl: 'views/post.html',
            controller: 'MainController'
        });

    //$locationProvider.html5Mode(true);

}]);