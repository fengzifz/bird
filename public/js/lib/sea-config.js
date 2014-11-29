/**
 * Created by damon on 14-9-25.
 * 配置 js 文件
 */

var pathLib = 'lib/',
    pathController = 'controllers/',
    pathService = 'services/';

seajs.config({
    base: '/js/',
    alias: {
        'app'                       : 'app.js',
        'MainController'            : pathController + 'MainController.js',
        'HomeController'            : pathController + 'HomeController.js',
        'LoginController'           : pathController + 'LoginController.js',
        'PostController'            : pathController + 'PostController.js',
        'MainService'               : pathService + 'MainService.js',
        'appRoutes'                 : 'appRoutes.js'
    },
    preload:[
        'app',
        'MainController'
    ]
});
