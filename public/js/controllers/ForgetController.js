/**
 * Created by damon on 14/11/16.
 */

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.controller('ForgetController', ['$scope', '$http',

            function($scope, $http) {
                $scope.forget = function() {
                    // TODO: forget password
                }
            }

        ]);

    }

});
