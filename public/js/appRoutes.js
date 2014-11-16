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

        // Login Page
        .when('/user/login', {
            templateUrl: 'views/user/login.html',
            controller: 'LoginController'
        })

        // Forget page
        .when('/user/forget', {
            templateUrl: 'views/user/forget.html',
            controller: 'ForgetController'
        });

    //$locationProvider.html5Mode(true);

}]);