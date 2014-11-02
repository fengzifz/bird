/**
 * Created by damon on 14/11/1.
 */

angular.module('MainController', []).controller('MainController', ['$scope', '$http', function($scope, $http) {

    $scope.getPost = function() {

        $http({method: 'GET', url: '/post'})
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {

            });
    }


}]);

//(function(angular) {
//
//
//    function MainController($scope, $http) {
//
//        //$http({method: 'GET', url: '/post'})
//        //    .success(function(data) {
//        //        console.log(data);
//        //    })
//        //    .error(function(data) {
//        //
//        //    });
//
//        $scope.getPost = function() {
//            $http({method: 'GET', url: '/post'})
//                .success(function(data) {
//                    console.log(data);
//                })
//                .error(function(err) {
//
//                });
//        }
//
//    }
//
//    var zaoQiLa = angular.module('app', []).controller('MainController', ['$scope', '$http', MainController]);
//    //var zaoQiLa = angular.module('app', []);
//
//})(angular);

