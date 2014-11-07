/**
 * Created by damon on 14/11/1.
 */


angular.module('MainController', []).controller('MainController', ['$scope', '$http', function($scope, $http) {

    /**
     * Display which template
     */
    $http({method: 'GET', url: '/user/checkLogin'})
        .success(function(data) {

            var isLogin = data.success,
                templatePath = 'views/user/login.html';

            if (isLogin) {
                templatePath = 'views/post/post.html';
            }

            $scope.getView = function() {
                return templatePath;
            }
        })
        .error(function(err) {

        });


}]);
