
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
 * 注册页面
 * 密码使用 md5 加密
 * 需要邮箱验证
 * @param req
 * @param res
 */
exports.reg = function(req, res) {



    res.render('user/reg', {
        title: zhCN.REGISTER
    });
}