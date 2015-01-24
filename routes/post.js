/**
 * Created by damon on 14/10/27.
 */

var express = require('express'),
    router = express.Router(),
    checkHelper = require('../helper/check_helper'),
    lang = require('../languages/zh_CN'),
    dateHelper = require('../helper/date_helper'),
    Post = require('../models/post'),
    path = require('../configs/path_config'),
    outputHelper = require('../helper/output_helper');

// ********** New API Start **********

/**
 * Get today post.
 *
 * Response
 * Not login: {code: 1001, codeName: "MSG_NOT_LOGIN", error: false, description: "没有登录" }
 * Have login: {code: 1002, codeName: "MSG_HAVE_LOGIN", error: false, description: "已经登录"}
 *
 */
router.get('/list', function(req, res) {

    // 1007: Nobody post today
    // 1008: Get today post successfully
    Post.getTodayPosts(null, function(err, doc) {

        // Maybe database error
        if (err) {
            return res.json(outputHelper.outputMsg(0));
        }

        if (doc.length == 0) {
            return res.json(outputHelper.outputMsg(1007));
        }

        // We return doc directly
        return res.json(doc);

    });

});

/**
 * Post
 *
 * Respond
 * Post successfully: {code: 1005, codeName: MSG_POST_SUCCESSFULLY, error: false, description: "签到成功"}
 */
router.post('/', function(req, res) {

    // 1005: Post successfully
    // 11: Post reach two times
    // 0: DB error

    // Get user from session
    var user = req.session.user;

    var post = {};

    post.name = user.name;
    post.time = dateHelper.getUnixTime();
    post.content = req.body.content;

    // User only can post two times everyday
    Post.getTodayPostsByUser(user.name, function(err, doc) {

        if (err) {
            return res.json(outputHelper.outputMsg(0));
        }

        if (doc.length >= 2) {
            return res.json(outputHelper.outputMsg(11));
        }

        // Initialize post
        var userPost = new Post(post);

        userPost.save(function(err, doc) {

            // DB error
            if (err) {
                return res.json(outputHelper.outputMsg((0)));
            }

            // Post successfully
            return res.json(outputHelper.outputMsg(1005));

        });
    });

});

// ********** New API end **********

// Check login
router.post('/', checkHelper.checkNotLogin);

/**
 * TODO: It will be removed after finish new API.
 * 签到页面
 * 列出今天的签到
 */
router.get('/list', function(req, res) {

    Post.getTodayPosts(null, function(err, doc) {

        if (err) {
            return res.send(err);
        }

        if (doc.length == 0) {
            return res.json({'message': lang.error.ERR_POSTS_NOT_FOUND_TODAY});
        }

        res.json(doc);

    });

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
