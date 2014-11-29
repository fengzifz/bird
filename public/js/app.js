/**
 *
 * Created by damon on 14/11/2.
 */

define(function(require, exports, module) {

    var dependence = [
        'ngSea',
        'ngRoute'
        //'appRoutes',
        //'MainController',
        //'HomeController',
        //'PostController',
        //'LoginController',
        //'ForgetController',
        //'RegisterController',
        //'LeftMenuController',
        //'ui.bootstrap'
    ];

    var app = angular.module('app', dependence);

    console.log(1);

    require('appRoutes');

    app.run(['$rootScope', '$ngSea', function ($rootScope, $ngSea) {

        app = $ngSea(app);

    }]);

    module.exports = app;
});

