/**
 * Created by damon on 14-9-11.
 */

var zhCN = require('../languages/zh_CN');

var helper = {};

module.exports = helper;

/**
 * 检查错误状态码，并返回相应的错误提示语
 * @param err
 * @returns {string}
 */
helper.checkErrorCode = function checkErrorCode(err) {
    var code = err.code,
        msg = '';

    switch (code) {
        // key 重复
        case 11000:
            msg = zhCN.ERR_DUPLICATE_EMAIL;
            break;
        default:
            // msg = zhCN.ERR_SAVE_FAIL;
            msg = code;
            break;
    }

    return msg;
};

/**
 * 检查登录
 * @param req
 * @param res
 * @param next
 * @returns {*|Request}
 */
helper.checkLogin = function checkLogin(req, res, next) {
    if (req.session.user) {
        req.flash('success', zhCN.SUCCESS_HAVE_LOGIN);
        return res.redirect('/');
    }

    next();
};

/**
 * 检查未登录
 * @param req
 * @param res
 * @param next
 * @returns {*|Request}
 */
helper.checkNotLogin = function checkNotLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('success', zhCN.SUCCESS_NOT_LOGIN);
        return res.redirect('/user/login');
    }

    next();
};
