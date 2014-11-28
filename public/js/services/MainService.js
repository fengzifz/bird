/**
 * Created by damon on 14/11/2.
 */

angular.module('MainService', []).factory('UserStatus', ['$http', '$q', function($http, $q) {
    return {
        get: function() {
            var deferred = $q.defer();

            $http({method: 'GET', url: '/user/checkLogin'})
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    }
}]);