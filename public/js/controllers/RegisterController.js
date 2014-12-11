/**
 * Created by damon on 14/11/16.
 */

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.controller('RegisterController', ['$scope', '$http', '$rootScope',

            function($scope, $http, $rootScope) {

                /**
                 * Post data: {mail: xxx, name: xxx, password: xxx, rePassword: xxx}
                 * Response: {code: xxx, codeName: xxx, error: true / false, description: xxx}
                 */
                $scope.register = function() {
                    // TODO: register
                    var regInfo = {
                        mail: $scope.mail,
                        name: $scope.username,
                        password: $scope.password,
                        rePassword: $scope.re_password
                    };

                    // TODO: Validate information - Do it after I finish modifying API

                    // Post data to server
                    $http({
                        url: '/user/reg',
                        method: 'POST',
                        header: {'Content-Type': 'application/json'},
                        data: JSON.stringify(regInfo)
                    }).success(function(data) {
                        // TODO: Remove it after testing
                        console.log(data);

                        // Message
                        var msg = {};

                        msg.error = false;
                        msg.description = data.description;

                        // data: {code: xxx, codeName: xxx, error: true / false, description: xxx}
                        // Some error happened
                        if (data.error) {
                            msg.error = true;
                        } else {
                            // TODO: 1. Change left menu; 2. Change main view
                            $rootScope.$broadcast('haveLogin', msg);
                        }

                        $rootScope.$broadcast('alterMsg', msg);

                    }).error(function(err) {
                        console.log(err);
                    });

                }

            }

        ]);

    };

});
