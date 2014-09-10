/**
 * Created by damon on 14-8-27.
 * 路由配置
 */

/**
 * 包依赖
 */
var sites = require('./routes/index');
var users = require('./routes/user');
var path = require('./configs/path_config');

/**
 * 路由配置
 *
 */
module.exports = function(app) {

    // Homepage
    app.use(path.home, sites);

    // User
    app.use(path.reg, users);

}
