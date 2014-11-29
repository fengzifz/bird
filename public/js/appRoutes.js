/**
 * Created by damon on 14/11/2.
 */


define(function(require, exports, module) {

    var app = require('app');

    app.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

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
            })

            // Register page
            .when('/user/reg', {
                templateUrl: 'views/user/reg.html',
                controller: 'RegisterController'
            });

        //$locationProvider.html5Mode(true);

    }]);

    module.exports = app;

});

