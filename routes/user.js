
/*
 * GET users listing.
 */

/**
 * 包依赖
 */
var zhCN = require('../languages/zh_CN');
var express = require('express');
var router = express.Router();
var validator = require('validator');
var crypto = require('crypto');
var User = require('../models/user');
var helper = require('../helper/check_helper');
var path = require('../configs/path_config');

/**
 * 注册页面
 * @param req
 * @param res
 */
router.get('/', function(req, res) {

    res.render('user' + path.reg, {
        title: zhCN.REGISTER
    });
});

/**
 * 提交注册表单
 * md5 加密
 * 邮箱验证
 * @param req
 * @param res
 */
router.post('/', function(req, res) {
    var user = {};

    user.mail = (req.body.mail).trim();
    user.name = (req.body.name).trim();
    user.password = (req.body.password).trim();
    user.rePassword = (req.body['re-password']).trim();

    // 检查用户信息
    var err = checkRegisterInfo(user);

    // Display message
    if (err.message) {
        req.flash('error', err.message);
        return res.redirect(path.reg);
    }

    // 通过验证
    // md5 base64 加密
    var md5 = crypto.createHash('md5');
    user.password = md5.update(user.password).digest('base64');

    // 创建新的 user 对象，用于保存到数据库
    var newUser = new User({
        name: user.name,
        password: user.password,
        mail: user.mail
    });

    // 保存到数据库
    newUser.save(function(err) {
        // Some error happened
        if (err) {
            req.flash('error', helper.checkErrorCode(err));
            return res.redirect(path.reg);
        }

        req.session.user = newUser;
        req.flash('success', zhCN.SUCCESS_REGISTER);
        return res.redirect(path.home);
    });

});


/**
 * 检查注册信息
 * @param user
 * @returns {{}}
 */
function checkRegisterInfo(user) {

    var err = {message: null};

    // 所有信息必须填写
    for (var p in user) {
        if (user[p] == null || user[p] == undefined || user[p] == '') {
            err.all = true;
            err.message = zhCN.ERR_SHOULD_ENTER_ALL;
            break;
        }
    }

    // 验证邮件格式
    if (!validator.isEmail(user.mail)) {
        err.mail = true;

        if (!err.message) {
            err.message = zhCN.ERR_INVALID_EMAIL;
        }
    }

    // 用户名只能使用字母、数字和下划线
    var usernamePatt = /([a-zA-Z0-9]|[_])$/;
    if (!validator.matches(user.name, usernamePatt)) {
        err.name = true;

        if (!err.message) {
            err.message = zhCN.ERR_INVALID_USERNAME;
        }
    }

    // 密码长度至少6位
    if (user.password.length < 6) {
        err.shortPwd = true;

        if (!err.message) {
            err.message = zhCN.ERR_INVALID_SHORT_PWD;
        }

    }

    // 密码必须包含数字和字母
    if (!validator.isAlphanumeric(user.password)) {
        err.alphanumeric = true;

        if (!err.message) {
            err.message = zhCN.ERR_INVALID_PASSWORD;
        }
    }

    // 密码要一致
    if (user.password != user.rePassword) {
        err.notSamePwd = true;

        if (!err.message) {
            err.message = zhCN.ERR_NOT_SAME_PASSWORD;
        }
    }

    return err;
}

// Express 4.x 需要把 router 暴露
module.exports = router;
