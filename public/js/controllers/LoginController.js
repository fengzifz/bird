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

                // data: {code: xxx, error: true/false, codeName: xxx, description: xxx}
                $rootScope.$broadcast('changeViewAfterLogin', data);

            }).error(function(err) {
                console.log(err);
            });
        };

        // ====== Animation ======
        //var listenEle = document.getElementById('module-bottom');
        //
        //var mc = new Hammer(listenEle);
        //
        //// let the pan gesture support all directions.
        //// this will block the vertical scrolling on a touch-device while on the element
        //mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        //
        //// listen to events...
        //mc.on("panleft panright panup pandown tap press", function(ev) {
        //    // myElement.textContent = ev.type +" gesture detected.";
        //    console.log(ev.type);
        //});

}]);
