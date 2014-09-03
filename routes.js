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
 *
 */
module.exports = function(app) {

    // Homepage
    // router.get('/', sites.index);
    app.use('/', sites);

    // User
    // Login
    app.use('/reg', users);

}
