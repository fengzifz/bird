/**
 * Using sea js as files loader.
 * Created by damon on 14/11/2.
 */

define(function(require, exports, module) {

    // Inject ngSea
    var app = angular.module('app', ['ngSea', 'MainController', 'LeftMenuController']);

    // Inject appRoutes
    require('appRoutes')(app);

    // Inject $ngSea when angular is running
    app.run(['$rootScope', '$ngSea', function ($rootScope, $ngSea) {
        app = $ngSea(app);
    }]);

    // Exports `app` as a module.
    module.exports = app;
});

