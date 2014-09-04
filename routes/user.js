
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

        req.flash('error', 'damon teset');
        return res.redirect('/reg');

    }


});


/**
 * 检查注册信息
 * @param user
 * @returns {{}}
 */
function checkRegisterInfo(user) {

    var err = {};

    // 所有信息必须填写
    for (var p in user) {
        if (user.p == null || user.p == undefined) {
            err.all = true;
            break;
        }
    }

    // 验证邮件格式
    if (!validator.isEmail(user.mail)) {
        err.mail = true;
    }

    // 用户名只能使用字母、数字和下划线
    var usernamePatt = /([a-zA-Z0-9]|[_])$/;
    if (!validator.matches(user.name, usernamePatt)) {
        err.name = true;
    }

    // 密码长度至少6位
    if (user.password.length < 6) {
        err.shortPwd = true;
    }

    // 密码必须包含数字和字母
    if (!validator.isAlphanumeric(user.password)) {
        err.alphanumeric = true;
    }

    // 密码要一致
    if (user.password != user.rePassword) {
        err.notSamePwd = true;
    }

    return err;
}

// Express 4.x 需要把 router 暴露
module.exports = router;
