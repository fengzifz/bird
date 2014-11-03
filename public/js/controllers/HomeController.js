/**
 * Created by damon on 14/11/3.
 */

angular.module('HomeController', []).controller('HomeController', ['$scope', '$http', function($scope, $http) {

    /**
     * Homepage
     * Display posts
     */
    $http({method: 'GET', url: '/post/list'})
        .success(function(data) {
            console.log(data);
        })
        .error(function(err) {
            console.log(err);
        });
}]);
