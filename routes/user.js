
/*
 * GET users listing.
 * res.json(): {success: 0, message: xxxxxx}
 */

/**
 * 包依赖
 */
var zhCN = require('../languages/zh_CN'),
    express = require('express'),
    router = express.Router(),
    validator = require('validator'),
    crypto = require('crypto'),
    User = require('../models/user'),
    checkHelper = require('../helper/check_helper'),
    path = require('../configs/path_config'),
    mail = require('../configs/mail'),
    generatePassword = require('../helper/password_helper'),
    MailHelper = require('../helper/mail_helper'),
    outputHelper = require('../helper/output_helper');

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


/**
 * 申请新的密码
 *
 * Response codes:
 * 4 - Invalid mail
 * 0 - Database error
 * 1 - User not found
 * 9000 - Mail server error
 * 1004 - Send new password successfully
 */
router.post('/forget', function(req, res) {

    var mail = (req.body.mail).trim(),
        pathFgt = path.user + '/forget';

    // 验证邮箱格式
    if (!validator.isEmail(mail)) {
        return res.json(outputHelper.outputMsg(4));
    }

    var emailIndex = {mail: (req.body.mail).trim()};

    User.get(emailIndex, function(err, doc) {
        // Database error
        if (err) {
            return res.json(outputHelper.outputMsg(0));
        }

        // 用户不存在
        if (!doc) {
            return res.json(outputHelper.outputMsg(1));
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
                return res.json(outputHelper.outputMsg(0));
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
                    return res.json(outputHelper.outputMsg(9000));
                }

                return res.json(outputHelper.outputMsg(1004));
            });

        });
    });
});

router.get('/deleteUserByEmail/:email', function(req, res) {
    var email = req.params.email,
        index = {email: email};

    console.log(44444444444444);
    User.deleteDoc(index, function(err, doc) {
        // DB err
        if (err) {
            console.log(11111111111);
            return res.json(outputHelper.outputMsg(0));
        }

        // User not found
        if (!doc) {
            console.log(22222222222222);
            return res.json(outputHelper.outputMsg(1));
        }

        return res.json(outputHelper.outputMsg(1009));
    });
});

// =====================================================

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
 * 加密密码
 * @param password
 * @returns {*}
 */
function hashPassword(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
}

// Express 4.x 需要把 router 暴露
module.exports = router;
