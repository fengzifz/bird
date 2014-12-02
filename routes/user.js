
/*
 * GET users listing.
 * res.json(): {success: 0, message: xxxxxx}
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
var checkHelper = require('../helper/check_helper');
var path = require('../configs/path_config');
var mail = require('../configs/mail');
var generatePassword = require('../helper/password_helper');
var MailHelper = require('../helper/mail_helper');
var outputHelper = require('../helper/output_helper');

// 检查登录状态
router.get('/reg', checkHelper.checkLogin);
router.get('/login', checkHelper.checkLogin);
router.get('/logout', checkHelper.checkNotLogin);
router.get(/\/profile/, checkHelper.checkNotLogin);

// =====================================================
// New api

/**
 * Check login status
 *
 * Response
 * Not login: {code: 1001, codeName: "MSG_NOT_LOGIN", error: false, description: "没有登录", success: false}
 * Have login: {code: 1002, codeName: "MSG_HAVE_LOGIN", error: false, description: "已经登录", success: true}
 *
 */
router.get('/checkLogin', function(req, res) {

    // Mark it as not login first...
    var result = outputHelper.outputMsg(1001);

    result.success = false;

    // Have login...
    if (req.session.user) {
        result = outputHelper.outputMsg(1002);
        result.success = true;
    }

    res.json(result);

});

/**
 * Login
 *
 * Response: {code: 1000, codeName: "MSG_SUCCESS_LOGIN", error: false, description: "登录成功"}
 *
 * Please ref. /config/codes.js to check the `code`
 */
router.post('/login', function(req, res) {
    var user = {};

    user.mail = (req.body.mail).trim();
    user.password = (req.body.password).trim();

    // 检查登录信息
    var err = checkHelper.checkLoginInfo(user);

    if (err) {
        return res.json(err);
    }

    // 验证通过
    user.password = hashPassword(user.password);

    // 查找是否存在这个 user
    User.get({mail: user.mail}, function(err, doc) {

        // Database error
        if (err) {
            return res.json(outputHelper.outputMsg(0));
        }

        // 用户不存在
        if (!doc) {
            return res.json(outputHelper.outputMsg(1));
        }

        // 密码错误
        if (doc.user.password != user.password) {
            return res.json(outputHelper.outputMsg(2));
        }

        // 验证成功
        req.session.user = doc.user;
        return res.json(outputHelper.outputMsg(1000));
    });

});

/**
 * 注册
 * md5 加密
 * 邮箱验证
 *
 * Response: {code: xxx, codeName: xxx, error: true / false, description: xxx}
 *
 * @param req
 * @param res
 */
router.post('/reg', function(req, res) {
    var user = {};

    user.mail = (req.body.mail).trim();
    user.name = (req.body.name).trim();
    user.password = (req.body.password).trim();
    user.rePassword = (req.body['rePassword']).trim();

    // Path
    var pathReg = path.user + '/reg';

    // 检查用户信息
    var err = checkHelper.checkRegisterInfo(user);

    // Display message
    // Below is the code:
    // Invalid email: 4
    // Invalid username: 5
    // Invalid password: 6 (Password must contain number and letter)
    // Re-Password should be same with password: 7
    // Must enter all text field: 8
    // The mail have already exist: 9
    // Send mail fail: 10
    // Register successfully: 1003
    if (err) {
        return res.json(err);
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

    User.get({name: user.name}, function(err, doc) {
        // Database err
        if (err) {
            return res.json(outputHelper.outputMsg(0));
        }

        // User have already exist
        if (doc) {
            return res.json(outputHelper.outputMsg(9));
        }

        // 保存到数据库
        newUser.save(function(err) {
            // Some error happened
            // Maybe duplicate email
            if (err) {
                return res.json(outputHelper.outputMsg(11000));
            }

            // 保存数据库成功后，发送邮件
            var mailOpt = {name: user.name, mail: user.mail, type: 'reg'},
                mailHelper = new MailHelper(mailOpt);

            mailHelper.send(function(err) {
                // Mail err
                if (err) {
                    return res.json(outputHelper.outputMsg(9000));
                }

                req.session.user = newUser;
                return res.json(outputHelper.outputMsg(1003));
            });

        });
    });
});

// =====================================================

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
 * 用户资料页面
 */
router.get('/profile', function(req, res) {

    var user = req.session.user,
        data = {};

    User.get({name: user.name}, function(err, doc) {

        data.title = zhCN.title.PROFILE;

        // Get user information
        if (err) {
            data.user = null;
        } else {
            data.user = doc.user;
        }

        res.render('user/profile', data);
    });

});

/**
 * 用户编辑页面
 */
router.get('/profile/edit', function(req, res) {
    var user = req.session.user,
        data = {};

    User.get({name: user.name}, function(err, doc) {
        data.title = zhCN.title.PROFILE_EDIT;

        if (err) {
            data.user = null;
        } else {
            data.user = doc.user;
        }

        res.render('user/edit', data);
    });

});

/**
 * 修改用户资料
 * TODO: 暂时添加修改目标时间
 */
router.post('/profile/edit', function(req, res) {

    var user = req.session.user,
        goalTime = req.body.goaltime,
        pathEdit = path.user + '/profile/edit',
        queryIndex = {name: user.name};

    User.get(queryIndex, function(err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect(pathEdit);
        }

        if (!doc) {
            req.flash('error', zhCN.ERR_USER_NOT_FOUND);
            return res.redirect(pathEdit);
        }

        // doc {user: {name: xxx, mail: xxx, ...}}
        var updateUser = new User(doc.user);
        updateUser.user.goalTime = goalTime;

        updateUser.update(queryIndex, function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect(pathEdit);
            }

            req.flash('success', zhCN.SUCCESS_PROFILE_UPDATE);
            return res.redirect('/user/profile/edit');
        });
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
        var password = generatePassword.generateRandomPwd(6),
            newPassword = hashPassword(password);

        // 更新数据库
        var newUser = new User({
            name: doc.user.name,
            mail: mail,
            password: newPassword
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



///**
// * 提交注册表单
// * md5 加密
// * 邮箱验证
// * @param req
// * @param res
// */
//router.post('/reg', function(req, res) {
//    var user = {};
//
//    user.mail = (req.body.mail).trim();
//    user.name = (req.body.name).trim();
//    user.password = (req.body.password).trim();
//    user.rePassword = (req.body['re-password']).trim();
//
//    // Path
//    var pathReg = path.user + '/reg';
//
//    // 检查用户信息
//    var err = checkRegisterInfo(user);
//
//    // Display message
//    if (err) {
//        req.flash('error', err);
//        return res.redirect(pathReg);
//    }
//
//    // 通过验证
//    // md5 base64 加密
//    user.password = hashPassword(user.password);
//
//    // 创建新的 user 对象，用于保存到数据库
//    var newUser = new User({
//        name: user.name,
//        password: user.password,
//        mail: user.mail
//    });
//
//    User.get({name: user.name}, function(err, doc) {
//        if (err) {
//            req.flash('error', err);
//            return res.redirect(pathReg);
//        }
//
//        if (doc) {
//            req.flash('error', '用户名已经存在');
//            return res.redirect(pathReg);
//        }
//
//        // 保存到数据库
//        newUser.save(function(err) {
//            // Some error happened
//            // Maybe duplicate email
//            if (err) {
//                req.flash('error', helper.checkErrorCode(err));
//                return res.redirect(pathReg);
//            }
//
//            // 保存数据库成功后，发送邮件
//            var mailOpt = {name: user.name, mail: user.mail, type: 'reg'},
//                mailHelper = new MailHelper(mailOpt);
//
//            mailHelper.send(function(err) {
//                if (err) {
//                    req.flash('error', zhCN.ERR_SMTP);
//                    return res.redirect(pathReg);
//                }
//
//                req.session.user = newUser;
//                req.flash('success', zhCN.SUCCESS_REGISTER);
//                return res.redirect(path.home);
//            });
//
//        });
//    });
//});

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
//function checkLoginInfo(user) {
//    // 所有信息必须填写
//    if (!user.mail || !user.password) {
//        return zhCN.ERR_SHOULD_ENTER_ALL;
//    }
//
//    // 验证邮箱格式
//    if (!validator.isEmail(user.mail)) {
//        return zhCN.ERR_INVALID_EMAIL;
//    }
//
//    return null;
//}

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

// Express 4.x 需要把 router 暴露
module.exports = router;
