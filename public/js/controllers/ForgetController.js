/**
 * Created by damon on 14/11/16.
 */

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.controller('ForgetController', ['$scope', '$http', '$rootScope',

            function($scope, $http, $rootScope) {
                $scope.forget = function() {
                    // TODO: forget password
                    var forgetInfo = {
                        mail: $scope.mail
                    };

                    $http({
                        url: '/user/forget',
                        method: 'post',
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(forgetInfo)
                    }).success(function(data) {
                        console.log(data);

                        var msg = {};

                        msg.error = false;
                        msg.description = data.description;

                        if (data.error) {
                            msg.error = true;
                        }

                        $rootScope.$broadcast('alterMsg', msg);

                    }).error(function(err) {
                        console.log(err);
                    });
                }
            }

        ]);

    }

});
