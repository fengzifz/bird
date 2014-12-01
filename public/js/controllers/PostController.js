/**
 * Created by damon on 14/11/3.
 */

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.controller('PostController', ['$scope', '$http',

            function($scope, $http) {
                $scope.maxLength = 50;

                // The object should bind with dom using director `ng-model`
                $scope.postInput = '';

                $scope.actualLength = $scope.maxLength;

                $scope.countLength = function() {
                    $scope.actualLength = $scope.maxLength - $scope.postInput.length;
                };

                $scope.doPost = function() {

                    // TODO: post data to server
                    console.log($scope.postInput);

                }
            }

        ]);

    };

});
