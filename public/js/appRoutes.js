/**
 * Created by damon on 14/11/2.
 */


define(function(require, exports, module) {

    module.exports = function (app) {

        app.config(['$routeProvider', function ($routeProvider) {

            $routeProvider

                // Home page
                .when('/', {
                    templateUrl: 'views/home.html',
                    controller: 'HomeController',
                    controllerUrl: 'controllers/HomeController'
                })

                // Login Page
                .when('/user/login', {
                    templateUrl: 'views/user/login.html',
                    controller: 'LoginController',
                    controllerUrl: 'controllers/LoginController'
                })

                // Forget page
                .when('/user/forget', {
                    templateUrl: 'views/user/forget.html',
                    controller: 'ForgetController',
                    controllerUrl: 'controllers/ForgetController'
                })

                // Register page
                .when('/user/reg', {
                    templateUrl: 'views/user/reg.html',
                    controller: 'RegisterController',
                    controllerUrl: 'controllers/RegisterController'
                })

                .otherwise({
                    redirectTo: '/'
                });

            //$locationProvider.html5Mode(true);

        }]);
    };
}
