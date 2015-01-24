/**
 * Created by damon on 14-9-11.
 */

var zhCN = require('../languages/zh_CN');
var validator = require('validator');
var outputHelper = require('../helper/output_helper');

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

/**
 * 检查用户登录信息
 * @param user
 * @returns {*}
 */
helper.checkLoginInfo = function checkLoginInfo(user) {
    // 所有信息必须填写
    if (!user.email || !user.password) {
        return outputHelper.outputMsg(3);
    }

    // 验证邮箱格式
    if (!validator.isEmail(user.email)) {
        return outputHelper.outputMsg(4);
    }

    return null;
};

/**
 * 检查注册信息
 *
 * Invalid email: 4
 * Invalid username: 5
 * Invalid password: 6 (Password must contain number and letter)
 * Re-Password should be same with password: 7
 * Must enter all text field: 8
 * Register successfully: 1003
 *
 * @param user
 * @returns {{}}
 */
helper.checkRegisterInfo = function checkRegisterInfo(user) {

    // 所有信息必须填写
    for (var p in user) {
        if (user[p] == null || user[p] == undefined || user[p] == '') {
            return outputHelper.outputMsg(8);
        }
    }

    // 验证邮件格式
    if (!validator.isEmail(user.email)) {
        return outputHelper.outputMsg(4);
    }

    // 用户名只能使用字母、数字和下划线
    var usernamePatt = /([a-zA-Z0-9]|[_])$/;
    if (!validator.matches(user.name, usernamePatt)) {
        return outputHelper.outputMsg(5);
    }

    // 密码必须包含数字和字母
    // 密码长度至少6位
    var alphaAndNumeric = /[A-Za-z][0-9]|[0-9][A-Za-z]/;
    if (!alphaAndNumeric.test(user.password) || user.password.length < 6) {
        return outputHelper.outputMsg(6);
    }

    // 密码要一致
    if (user.password != user.rePassword) {
        return outputHelper.outputMsg(7);
    }

    return null;

};