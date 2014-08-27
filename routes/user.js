
/*
 * GET users listing.
 */

/**
 * 包依赖
 */
var zhCN = require('../languages/zh_CN');

/**
 *
 * @param req
 * @param res
 */
exports.list = function(req, res) {
    res.send("respond with a resource");
};

/**
 * 登录页面
 * @param req
 * @param res
 */
exports.reg = function(req, res) {
    res.render('user/reg', {
        title: zhCN.REGISTER
    });
}