/**
 * Created by damon on 14/11/1.
 */

angular.module('MainController', []).controller('MainController', ['$scope', '$http', function($scope, $http) {

    /**
     * Homepage
     * Display posts
     */
    $http({method: 'GET', url: '/post'})
        .success(function(data) {
            console.log(data);
        })
        .error(function(err) {
            console.log(err);
        });

    //$scope.getPost = function() {
    //
    //    $http({method: 'GET', url: '/post'})
    //        .success(function(data) {
    //            console.log(data);
    //        })
    //        .error(function(data) {
    //
    //        });
    //}


}]);
