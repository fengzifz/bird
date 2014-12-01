/**
 * Created by damon on 14/11/1.
 */

'use strict';

angular.module('MainController', []).controller('MainController', ['$scope', '$http', '$location',

        function($scope, $http) {

            var loginPath = 'views/user/login.html',
                postPath = 'views/post/post.html',
                loginLeftMenu = 'views/menu/left_menu_login.html',
                logoutLeftMenu = 'views/menu/left_menu_logout.html';

            /**
             * Display which template
             */
            $http({method: 'GET', url: '/user/checkLogin'})
                .success(function(data) {

                    var isLogin = data.success,
                        templatePath = logoutLeftMenu;

                    // 是否隐藏 退出 按钮
                    $scope.logoutHidden = 'hidden';

                    if (isLogin) {
                        templatePath = loginLeftMenu;
                        displayPostModule(postPath);
                        $scope.logoutHidden = '';
                    }

                    changeLeftMenu(templatePath);
                })
                .error(function(err) {
                    console.log(err);
                });

            /**
             * 登录成功后，改变 ng-include 里面的 html
             * `changeViewAfterLogin` 是由 `LoginController` 那里广播过来的
             */
            $scope.$on('haveLogin', function(event, data) {

                // Display post module
                if (!data.error) {
                    displayPostModule(postPath);
                }

                // Display alert message
                addAlert(data);
            });

            // TODO: 页面显示控制
            function redirect(isLogin) {

            }

            /**
             * 左菜单 CSS 类名切换
             */
            $scope.slideMenu = function() {
                var clsNameActive = 'leftMenuActive',
                    clsNameAnimation = 'animation-push-right',
                    btnLeftMenu = angular.element(document.querySelector('#btn-left-menu')),
                    leftMenu = angular.element(document.querySelector('.main-content')),
                    isLeftMenuActiveCls = btnLeftMenu.hasClass(clsNameActive);

                console.log(111111);

                if (!isLeftMenuActiveCls) {
                    btnLeftMenu.addClass(clsNameActive);
                    leftMenu.addClass(clsNameAnimation);
                } else {
                    btnLeftMenu.removeClass(clsNameActive);
                    leftMenu.removeClass(clsNameAnimation);
                }

            };

            /**
             * Add alert
             * @param data
             */
            function addAlert(data) {

                $scope.alerts = [];

                var type = 'success';

                if (data.error) {
                    type = 'danger';
                }

                $scope.alerts.push({type: type, msg: data.description});
            }

            /**
             * Close alert
             * @param index
             */
            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };

            /**
             * Display login module or post module
             * @param viewPath
             */
            function displayPostModule(viewPath) {
                $scope.getView = function() {
                    return viewPath;
                }
            }

            /**
             * 返回 left menu 模板路径
             * @param leftMenuPath
             */
            function changeLeftMenu(leftMenuPath) {
                $scope.getLeftMenu = function() {
                    return leftMenuPath;
                }
            }


            /**
             * Change the error message css class
             * @param error
             * @param message
             */
            function changeAlertMsg(error, message) {
                var cls;

                if (error) {
                    cls = 'danger animated bounceOutLeft';
                } else {
                    cls = 'success';
                }

                $scope.alertClass = cls;
                $scope.alertMessage = message;
            }

    }]);


