/**
 * Created by damon on 14/10/27.
 */

var express = require('express');
var router = express.Router();

/**
 * 签到页面
 */
router.get('/', function(req, res) {
    res.render('post/post', {
        title: '签到'
    });
});

/**
 * 登录用户发表签到
 */
router.post('/post', function(req, res) {

    var currentUser = req.session.user;

    if (currentUser) {
        res.header('errorcode', 403);
        req.flash('error', '没有权限');
        return res.redirect('/post');
    }

    return res.redirect('/post');
});

/**
 * 设置目标起床时间
 */
router.post('/setgoaltime', function(req, res) {
    if (req.session.user) {
        console.log(9);
    } else {
        console.log(8);
    }
    return res.redirect('/login');
});

module.exports = router;
