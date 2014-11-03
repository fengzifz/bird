/**
 * Created by damon on 14/11/2.
 */

angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // Home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })

        // Post page
        .when('/post', {
            templateUrl: 'views/post/post.html',
            controller: 'PostController'
        });

    //$locationProvider.html5Mode(true);

}]);