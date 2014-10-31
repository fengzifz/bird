/**
 * Created by damon on 14/10/26.
 */

var should = require('should');
var request = require('supertest');
var app = require('../../app');
var path = require('../../configs/path_config');
var user = require('../../routes/user');
var post = require('../../routes/');

/**
 * TODO: 要实现的接口
 * getGoalTimeByMail();
 * deletePostsByMail();
 * getTodayPostsByMail();
 * addPost();
 *
 */

describe('Sign in routes/post.js', function() {

    // 打开 post 页面，http 返回 200
    // TODO: 移到去 test/route.js
    it('Post page: should be 200', function(done) {
        request(app).get(path.post).end(function(err, res) {
            res.statusCode.should.equal(200);
            done();
        });
    });

    // 未登录的用户，不能 post
    it('Guest can not post', function(done) {
        request(app).post(path.post + '/post').end(function(err, res) {
            (err === null).should.equal(true);
            res.statusCode.should.equal(302);
            res.header.location.should.equal(path.post);
            done();
        });
    });

    describe('Login test cases', function() {

        var Cookies;

        // 登录
        before(function(done) {
            request(app).post(path.user + '/login')
                .send({'mail': '398846606@qq.com', 'password': '3bSVcm'})
                .expect(200)
                .end(function(err, res) {
                    Cookies = res.headers['set-cookie'].pop().split(';')[0];
                    done();
                });
        });

        // 用户可以设置每天的目标起床时间
        it('User who have login can set goal time', function(done) {

            var req = request(app).post(path.user + '/profile/edit');

            req.cookies = Cookies;

            req.end(function(err, res) {
                (err === null).should.equal(true);
                res.statusCode.should.equal(302);
                res.text.should.containEql(''); // 设置成功
                done();
            });

        });

        // 用户每天只能在目标时间之前签到
        // 小于目标时间，可以签到
        // 大于目标时间，不能签到
        describe('Post routes/post.js', function() {

            var goalTime;

            // TODO: Get user goal time
            before(function(done) {
                // TODO: 实现 getGoalTimeByMail()
                goalTime = post.getGoalTimeByMail('398846606@qq.com');

                done();
            });

            // 在目标时间之前，可以 post
            it('User can post before the goal time', function(done) {

                var postContent = {timestamp: goalTime - 1000, content: 'Post testing.', mail: '398846606@qq.com'},
                    req = request(app).post(path.post);

                req.cookies = Cookies;

                req.send(postContent).end(function(err, res) {
                    (err === null).should.equal(true);
                    res.statusCode.should.equal(302);
                    res.text.should.containEql(''); // TODO: 发表成功
                });

            });

            // 在目标时间之后，不能 post
            it('User can not post after the goal time', function(done) {
                var postContent = {time: goalTime + 1000, content: 'Post testing.', mail: '398846606@qq.com'},
                    req = request(app).post(path.post);

                req.cookies = Cookies;

                req.send(postContent).end(function(err, res) {
                    (err === null).should.equal(true);
                    res.statusCode.should.equal(302);
                    res.text.should.containEql(''); // TODO: 已经超过目标时间
                });
            });

            // 删除测试数据
            after(function(done) {
                // TODO: deletePostsByMail()
                post.deletePostsByMail('398846606@qq.com');
                done();
            });

        });

        // 用户每天只能签到两次
        describe('Post routes/post.js', function() {

            var todayPosts,
                testMail = '398846606@qq.com',
                goalTime,
                newPost;

            before(function(done) {

                todayPosts = post.getTodayPostsByMail(testMail);

                goalTime = post.getGoalTimeByMail(testMail);

                newPost = {timestamp: goalTime - 1000, content: 'New post.', mail: testMail};

                if (todayPosts) {

                    var postLen = todayPosts.length;

                    // 如果只有一条 post，则添加一条
                    if (postLen == 1) {
                        todayPosts = post.addPost(newPost);
                    }

                } else {
                    // 如果没有 post，则添加两条
                    // 第一条 post
                    newPost.timestamp = goalTime - 2000;
                    post.addPost(newPost);

                    // 第二条 post
                    newPost.timestamp = goalTime + 1000;
                    post.addPost(newPost);
                }
            });

            it('User can only post two times before goal time.', function(done) {
                var req = request(app).post(path.post);

                req.cookies = Cookies;

                req.send(newPost).end(function(err, res) {
                    (err === null).should.equal(true);
                    res.statusCode.should.equal(302);
                    res.text.should.containEql(''); // 一天只能发表两条
                    done();
                });
            });

            after(function(done) {
                post.deletePostsByMail('398846606@qq.com');
                done();
            });

        });

        // 用户每天两次的签到时间间隔不能小于 5 分钟
        describe('Post routes/post.js', function() {
            var goalTime,
                testMail = '398846606@qq.com',
                newPost = {timestamp: null, content: 'Post testing.', mail: testMail},
                todayPosts;

            describe('User can post', function() {
                before(function(done) {
                    // Get goal time
                    goalTime = post.getGoalTimeByMail(testMail);

                    // Check if have post today
                    todayPosts = post.getTodayPostsByMail(testMail);

                    // 如果今天没有 post，则添加一条
                    if (!todayPosts) {
                        newPost.timestamp = goalTime - 2000;
                        post.addPost(newPost);
                    }

                    done();
                });

                // 两次 post 的时间大于 5 分钟时，可以 post 第二条
                it('User can post the second post after 5min which the time user post the first post at.', function(done) {
                    var req = request(app).post(path.post);

                    req.cookies = Cookies;

                    req.send(newPost).post(path.post).end(function(err, res) {
                        (err === null).should.equal(true);
                        res.statusCode.should.equal(302);
                        res.text.should.containEql(''); // 发表成功
                        done();
                    });

                });

                after(function(done) {
                    post.deletePostsByMail(testMail);
                    done();
                });
            });


            describe('User can not post', function() {
                before(function(done) {
                    // Get goal time
                    goalTime = post.getGoalTimeByMail(testMail);

                    // Check if have post today
                    todayPosts = post.getTodayPostsByMail(testMail);

                    // 如果今天没有 post，则添加一条
                    if (!todayPosts) {
                        newPost.timestamp = goalTime - 2000;
                        post.addPost(newPost);
                    }

                    done();
                });

                // 两次 post 的时间小于 5 分钟时，不能 post 第二条
                it('User can not post the second post if the time internal is less than 5 min.', function(done) {
                    var req = request(app).post(path.post);

                    req.cookies = Cookies;

                    req.send(newPost).post(path.post).end(function(err, res) {
                        (err === null).should.equal(true);
                        res.statusCode.should.equal(302);
                        res.text.should.containEql(''); // 5分钟
                        done();
                    });
                });

                after(function(done) {
                    post.deletePostsByMail(testMail);
                    done();
                });
            });

        });

    });

});