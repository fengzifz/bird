/**
 * Created by damon on 14-9-25.
 * 配置 js 文件
 */

var pathLib = 'lib/',
    pathController = 'controller/';

seajs.config({
    base: '/js/',
    alias: {
        'angular'                   : pathLib + 'angular.js',
        'angular-route'             : pathLib + 'angular-route.js',
        'MainController'            : pathController + 'MainController.js',
        'HomeController'            : pathController + 'HomeController.js',
        'LoginController'           : pathController + 'LoginController.js',
        'PostController'            : pathController + 'PostController.js'
    },
    preload:[
        'angular',
        'angular-route'
    ]
});
