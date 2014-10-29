/**
 * Created by damon on 14/10/27.
 */

var express = require('express');
var router = express.Router();
var checkHelper = require('../helper/check_helper');
var zhCh = require('../languages/zh_CN');

// Check login
router.post('/', checkHelper.checkNotLogin);

/**
 * 签到页面
 * TODO: 列出今天的 post
 */
router.get('/', function(req, res) {
    res.render('post/post', {
        title: zhCh.title.POST
    });
});

/**
 * 登录用户发表签到
 */
router.post('/post', function(req, res) {

    

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
