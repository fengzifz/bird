/**
 * Created by damon on 14/11/1.
 */

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.controller('LoginController', ['$scope', '$http', '$rootScope',

            function($scope, $http, $rootScope) {

                $scope.login = function() {

                    var loginInfo = {
                        mail: $scope.mail,
                        password: $scope.password
                    };

                    $http({
                        url: '/user/login',
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        data: JSON.stringify(loginInfo)
                    }).success(function(data) {

                        var msg = {};

                        msg.error = false;
                        msg.description = data.description;

                        if (data.error) {
                            msg.error = true;
                        } else {
                            // data: {code: xxx, error: true/false, codeName: xxx, description: xxx}
                            $rootScope.$broadcast('haveLogin', msg);
                        }

                        $rootScope.$broadcast('alterMsg', msg);

                    }).error(function(err) {
                        console.log(err);
                    });
            };

        }]);
    }
});
