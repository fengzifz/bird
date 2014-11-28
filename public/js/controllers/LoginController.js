/**
 * Created by damon on 14/11/1.
 */


angular
    .module('LoginController', [])
    .controller('LoginController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {

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

                console.log(data);

                // data: {code: xxx, error: true/false, codeName: xxx, description: xxx}
                $rootScope.$broadcast('haveLogin', data);

            }).error(function(err) {
                console.log(err);
            });
        };

}]);
