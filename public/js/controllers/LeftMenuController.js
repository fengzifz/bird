/**
 * Created by damon on 14/11/16.
 */

angular
    .module('LeftMenuController', [])
    .controller('LeftMenuController', ['$scope', '$http', '$location', function($scope, $http, $location) {

        // Active the current menu
        var url = $location.url();

        var leftMenuWrap = angular.element(document.querySelector('.left-menu')),
            leftMenuBtn = leftMenuWrap.find('li').find('a');

        // Active the left menu when page load
        activeLeftMenu(url);

        // Left menu click action
        // Angular 1.0.8 use `onClick` event
        // Angular 1.2.x use `on` event
        leftMenuBtn.onclick = function() {
            var ngMe = angular.element(this),
                parent = ngMe.parent(),
                url;

            // Do nothing if <li> has "current" class name
            if (parent.hasClass('current')) {
                return;
            }

            url = parent.attr('class');

            activeLeftMenu(url);

            // Remove "leftMenuActive" class name on <div#btn-left-menu>
            // Remove "animation-push-right" class name on <div.main-content>
            angular.element(document.querySelector('.main-content')).removeClass('animation-push-right');
            angular.element(document.querySelector('#btn-left-menu')).removeClass('leftMenuActive');
        };

        /**
         * Active left menu
         * @param url
         */
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
