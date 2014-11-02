/**
 * Created by damon on 14/10/27.
 */

var express = require('express');
var router = express.Router();
var checkHelper = require('../helper/check_helper');
var zhCh = require('../languages/zh_CN');
var dateHelper = require('../helper/date_helper');
var Post = require('../models/post');
var path = require('../configs/path_config');

// Check login
router.post('/', checkHelper.checkNotLogin);

/**
 * 签到页面
 * TODO: 列出今天的 post
 */
router.get('/', function(req, res) {
    res.json({title: zhCh.title.POST});

    //res.render('post/post', {
    //    title: zhCh.title.POST
    //});
});

/**
 * 登录用户发表签到
 */
router.post('/', function(req, res) {

    var user = req.session.user,
        content = req.body.content,
        time = dateHelper.getUnixTime(),
        pathPost = path.post;

    // TODO: 验证
    // 过滤 &lt; 和 &gt;

    var post = new Post({
        name: user.name,
        content: content,
        time: time
    });

    console.log(post);

    post.save(function(err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect(pathPost);
        }

        req.flash('success', '签到成功');
        return res.redirect(pathPost);
    });
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
