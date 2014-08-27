/**
 * Created by damon on 14-8-27.
 * 路由配置
 */

/**
 * 包依赖
 */
var sites = require('./routes/index');
var users = require('./routes/user');

/**
 * 路由配置
 * @param app
 */
module.exports = function(app) {

    // Homepage
    app.get('/', sites.index);

    // User
    // Login
    app.get('/reg', users.reg);

}
