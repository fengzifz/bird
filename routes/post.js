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

module.exports = router;
