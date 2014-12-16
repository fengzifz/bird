/**
 * Created by damon on 14/11/16.
 */

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.controller('ForgetController', ['$scope', '$http', '$rootScope',

            function($scope, $http, $rootScope) {
                $scope.forget = function() {

                    var forgetInfo = {
                        mail: $scope.mail
                    };

                    // Send data to server
                    $http({
                        url: '/user/forget',
                        method: 'post',
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(forgetInfo)
                    }).success(function(data) {

                        var msg = {};

                        msg.error = false;
                        msg.description = data.description;

                        // Some error
                        if (data.error) {
                            msg.error = true;
                        }

                        // Tell MainController to display the message
                        $rootScope.$broadcast('alterMsg', msg);

                    }).error(function(err) {
                        console.log(err);
                    });
                }
            }

        ]);

    }

});
