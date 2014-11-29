/**
 *
 * Created by damon on 14/11/2.
 */

define(function(require, exports, module) {

    var app = angular.module('app', ['ngSea']);

    require('appRoutes')(app);

    app.run(['$rootScope', '$ngSea', function ($rootScope, $ngSea) {

        app = $ngSea(app);

    }]);

    module.exports = app;
});

