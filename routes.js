/**
 * Created by damon on 14-8-27.
 * 路由配置
 */

/**
 * 包依赖
 */
var index = require('./routes/index');
var users = require('./routes/user');
var path = require('./configs/path_config');

/**
 * 路由配置
 *
 */
module.exports = function(app) {

    // Homepage
    app.use(path.home, index);

    // User
    // Include register and login
    app.use(path.user, users);

};
