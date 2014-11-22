/**
 * Created by damon on 14/11/16.
 */

angular
    .module('LeftMenuController', [])
    .controller('LeftMenuController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {

        // Active the current menu
        var url = $location.url();

        var leftMenuWrap = angular.element(document.querySelector('.left-menu')),
            leftMenuBtn = leftMenuWrap.find('li').find('a');

        // Active the left menu when page load
        activeLeftMenu(url);

        // Left menu click action
        leftMenuBtn.on('click', function() {
            var ngMe = angular.element(this),
                parent = ngMe.parent(),
                url;

            // Do nothing if <li> has "current" class name
            if (parent.hasClass('current')) {
                return;
            }

            url = parent.attr('class');

            activeLeftMenu(url);

        });

        function activeLeftMenu(url) {
            // Get last uri
            var urlArr = url.split('/'),
                arrLen = urlArr.length,
                lastUri = urlArr[arrLen - 1],
                cls,
                clsCurrent = 'current';

            // If last uri is empty, we can make sure that it is homepage
            if (lastUri == '') {
                cls = 'home';
            } else {
                cls = lastUri;
            }

            cls = 'li.' + cls;

            var ngEle = angular.element(document.querySelector(cls));

            // Remove all "current" class name of brother elements
            leftMenuWrap.find('li').removeClass(clsCurrent);

            // Add "current" class name to the element which we click
            ngEle.addClass(clsCurrent);
        }

    }]);
