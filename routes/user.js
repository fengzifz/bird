
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

/**
 * 注册页面
 * @param req
 * @param res
 */
router.get('/', function(req, res) {

    res.render('user/reg', {
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
    if (err.length != 0) {

        for (var p in err) {
            req.flash('error', err.message);
            return res.redirect('/reg');
        }

    }


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
        if (user[p] == null || user[p] == undefined) {
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
