/**
 * Created by damon on 14/11/3.
 */

define(function(require, exports, module) {

    module.exports = function(app) {

        app.register.controller('HomeController', ['$scope', '$http',

            function($scope, $http) {
                /**
                 * Homepage
                 * Display posts
                 */
                $http({method: 'GET', url: '/post/list'})
                    .success(function(data) {
                        console.log(data);

                        var msg = {};
                        msg.error = false;
                        msg.description = data.description;

                        if (data.error) {
                            msg.error = true;
                        }

                        // $scope.data = data;
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            }
        ]);
    }

});
