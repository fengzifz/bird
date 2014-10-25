
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
var mail = require('../configs/mail');
var generatePassword = require('../helper/password_helper');
var MailHelper = require('../helper/mail_helper');

// 检查登录状态
router.get('/reg', checkLogin);
router.get('/login', checkLogin);
router.get('/logout', checkNotLogin);

/**
 * 注册页面
 * @param req
 * @param res
 */
router.get('/reg', function(req, res) {
    res.render('user/reg', {
        title: zhCN.REGISTER
    });
});

/**
 * 登录页面
 */
router.get('/login', function(req, res) {
    res.render('user/login', {
        title: zhCN.LOGIN
    });
});

/**
 * 退出登录
 */
router.get('/logout', function(req, res) {

    // Empty user in session
    req.session.user = null;

    // Redirect to login page
    req.flash('success', zhCN.SUCCESS_LOGOUT);
    return res.redirect('/user/login');
});

/**
 * 忘记密码
 */
router.get('/forget', function(req, res) {
    res.render('user/forget', {
        title: zhCN.FORGET
    });
});

/**
 * 申请新的密码
 */
router.post('/forget', function(req, res) {

    var mail = (req.body.mail).trim(),
        pathFgt = path.user + '/forget';

    // 验证邮箱格式
    if (!validator.isEmail(mail)) {
        req.flash('error', zhCN.ERR_INVALID_EMAIL);
        return res.redirect(pathFgt);
    }

    var emailIndex = {mail: (req.body.mail).trim()};

    User.get(emailIndex, function(err, doc) {
        // Database error
        if (err) {
            req.flash('error', err);
            return res.redirect(pathFgt);
        }

        // 用户不存在
        if (!doc) {
            req.flash('error', zhCN.ERR_USER_NOT_FOUND);
            return res.redirect(pathFgt);
        }

        // 生成6位随机密码
        var password = generatePassword.generateRandomPwd(6);

        // 更新数据库
        var newUser = new User({
            name: doc.user.name,
            mail: mail,
            password: hashPassword(password)
        });

        newUser.update(emailIndex, function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect(pathFgt);
            }

            // 发送到用户邮箱
            // newUser.password = password;
            var mailOpt = {
                mail: newUser.user.mail,
                name: newUser.user.name,
                password: password,
                type: 'fgt'
            };

            var mailHelper = new MailHelper(mailOpt);

            mailHelper.send(function(err) {

                if (err) {
                    req.flash('error', zhCN.ERR_SEND_MAIL_FAIL);
                    return res.redirect(pathFgt);
                }

                req.flash('success', zhCN.SUCCESS_NEW_PWD);
                return res.redirect(pathFgt);
            });

        });
    });
});

/**
 * 登录
 */
router.post('/login', function(req, res) {
    var user = {};

    user.mail = (req.body.mail).trim();
    user.password = (req.body.password).trim();

    // Login path
    var pathLogin = path.user + '/login';

    // 检查登录信息
    var err = checkLoginInfo(user);

    if (err) {
        req.flash('error', err);
        return res.redirect(pathLogin);
    }

    // 验证通过
    user.password = hashPassword(user.password);

    // 查找是否存在这个 user
    User.get({mail: user.mail}, function(err, doc) {

        // Database error
        if (err) {
            req.flash('error', err);
            return res.redirect(pathLogin);
        }

        // 用户不存在
        if (!doc) {
            req.flash('error', zhCN.ERR_USER_NOT_FOUND);
            return res.redirect(pathLogin);
        }

        // 密码错误
        if (doc.password != user.password) {
            req.flash('error', zhCN.ERR_PASSWORD_WRONG);
            return res.redirect(pathLogin);
        }

        // 验证成功
        req.session.user = doc;
        req.flash('success', zhCN.SUCCESS_LOGIN);
        return res.redirect('/');
    });

});

/**
 * 提交注册表单
 * md5 加密
 * 邮箱验证
 * @param req
 * @param res
 */
router.post('/reg', function(req, res) {
    var user = {};

    user.mail = (req.body.mail).trim();
    user.name = (req.body.name).trim();
    user.password = (req.body.password).trim();
    user.rePassword = (req.body['re-password']).trim();

    // Path
    var pathReg = path.user + '/reg';

    // 检查用户信息
    var err = checkRegisterInfo(user);

    // Display message
    if (err) {
        req.flash('error', err);
        return res.redirect(pathReg);
    }

    // 通过验证
    // md5 base64 加密
    user.password = hashPassword(user.password);

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
            return res.redirect(pathReg);
        }

        // 保存数据库成功后，发送邮件
        if (sendMail(newUser, 'reg')) {
            req.flash('success', zhCN.ERR_SMTP);
            return res.redirect(pathReg);
        }

        req.session.user = newUser;
        req.flash('success', zhCN.SUCCESS_REGISTER);
        return res.redirect(path.home);
    });

});

/**
 * Send email
 * @param user
 * @param type
 */

function sendMail(user, type) {
    var opt;

    if (type == 'reg') {
        mail.mailOptReg.to = user.mail;
        mail.mailOptReg.html = mail.mailOptReg.html.replace(/zaoqila_user/, user.name);

        opt = mail.mailOptReg;
    } else if (type == 'fgt') {
        mail.mailOptFgt.to = user.mail;
        mail.mailOptFgt.html = mail.mailOptFgt.html.replace(/zaoqila_user/, user.name);
        mail.mailOptFgt.html = mail.mailOptFgt.html.replace(/zaoqila_password/, user.password);

        opt = mail.mailOptFgt;
    }

    mail.transporter.sendMail(opt, function(err) {
        if (err) {
            console.log('Send mail fail.');
            return true;
        } else {
            console.log('Send mail successfully.');
            return false;
        }
    });
}

/**
 * 检查登录
 * @param req
 * @param res
 * @param next
 * @returns {*|Request}
 */
function checkLogin(req, res, next) {
    if (req.session.user) {
        req.flash('success', zhCN.SUCCESS_HAVE_LOGIN);
        return res.redirect('/');
    }

    next();
}

/**
 * 检查未登录
 * @param req
 * @param res
 * @param next
 * @returns {*|Request}
 */
function checkNotLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('success', zhCN.SUCCESS_NOT_LOGIN);
        return res.redirect('/user/login');
    }

    next();
}

/**
 * 加密密码
 * @param password
 * @returns {*}
 */
function hashPassword(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
}

/**
 * 检查用户登录信息
 * @param user
 * @returns {*}
 */
function checkLoginInfo(user) {
    // 所有信息必须填写
    if (!user.mail || !user.password) {
        return zhCN.ERR_SHOULD_ENTER_ALL;
    }

    // 验证邮箱格式
    if (!validator.isEmail(user.mail)) {
        return zhCN.ERR_INVALID_EMAIL;
    }

    return null;
}

/**
 * 检查注册信息
 * @param user
 * @returns {{}}
 */
function checkRegisterInfo(user) {

    // 所有信息必须填写
    for (var p in user) {
        if (user[p] == null || user[p] == undefined || user[p] == '') {
            return zhCN.ERR_SHOULD_ENTER_ALL;
        }
    }

    // 验证邮件格式
    if (!validator.isEmail(user.mail)) {
        return zhCN.ERR_INVALID_EMAIL;
    }

    // 用户名只能使用字母、数字和下划线
    var usernamePatt = /([a-zA-Z0-9]|[_])$/;
    if (!validator.matches(user.name, usernamePatt)) {
        return zhCN.ERR_INVALID_USERNAME;
    }

    // 密码长度至少6位
    if (user.password.length < 6) {
        return zhCN.ERR_INVALID_SHORT_PWD;
    }

    // 密码必须包含数字和字母
    var alphaAndNumeric = /[A-Za-z][0-9]|[0-9][A-Za-z]/;
    if (!alphaAndNumeric.test(user.password)) {
        return zhCN.ERR_INVALID_PASSWORD;
    }

    // 密码要一致
    if (user.password != user.rePassword) {
        return zhCN.ERR_NOT_SAME_PASSWORD;
    }

    return null;

}

router.checkRegisterInfo = checkRegisterInfo;
router.sendMail = sendMail;

// Express 4.x 需要把 router 暴露
module.exports = router;
