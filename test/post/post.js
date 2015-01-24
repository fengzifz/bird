/**
 * Created by damon on 14/10/26.
 */

var should = require('should'),
    request = require('supertest'),
    app = require('../../app'),
    path = require('../../configs/path_config'),
    user = require('../../routes/user'),
    post = require('../../routes/'),
    User = require('../../models/user'),
    Post = require('../../models/post');

/**
 * TODO: Step 1
 * addPost()
 * deletePostByName()
 * deleteTodayPostByName()
 * getTodayPost()
 */

/**
 * TODO: Step 2
 * 1. User only can post before goal time
 *
 * Think the API...
 */


describe('Post unit test routes/post.js', function() {
    // TODO: Post successfully

    describe('Login user post successfully', function() {
        // Register a test user
        var cookie,
            registerUser = {
                email: 'aaa@aaa.com',
                name: 'Damon aaa',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            },
            loginUser = {
                email: registerUser.email,
                password: registerUser.password
            },
            postMsg = {content: 'Damon post test4'};

        // Register
        before(function(done) {
            request(app).post(path.user + '/reg')
                .send(registerUser)
                .end(function(err, res) {
                    done();
                });
        });

        // Login and set the session
        before(function(done) {
            request(app).post(path.user + '/login')
                .send(loginUser)
                .end(function(err, res) {
                    if (res.body.codeName.should.equal('MSG_SUCCESS_LOGIN')) {
                        cookie = res.headers['set-cookie'].pop().split(';')[0];
                    }
                    done();
                });
        });

        it('Post successfully', function(done) {
            var req = request(app).post(path.post);

            // Set cookie
            req.cookies = cookie;

            // Respond code:
            // 1005: Post successfully
            // 1006: Delete post successfully
            // 11: Post have reached two times
            req.send(postMsg).end(function(err, res) {
                (err === null).should.be.true;
                res.body.codeName.should.equal('MSG_POST_SUCCESSFULLY');
                done();
            });

        });

        // After testing, delete test data, including test account and test post.
        // Notice: Name / email is unique when user register, so we can delete post by username
        // Delete post
        after(function(done) {
            Post.deleteTodayPostsByUser(registerUser.name, function(err, doc) {
                (err === null).should.be.true;
                done();
            });
        });

        // Delete user
        after(function(done) {
            User.deleteDoc({email: registerUser.email}, function(err, doc) {
                (err === null).should.be.true;
                done();
            });
        });

    });

    // User only can post 2 times everyday
    describe('User only can post 2 times everyday', function() {
        var cookie,
            registerUser = {
                email: 'damon@damon.com',
                name: 'Damon chen654',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            },
            loginUser = {
                email: registerUser.email,
                password: registerUser.password
            },
            postMsg1 = {content: 'Damon post test 1.'},
            postMsg2 = {content: 'Damon post test 2.'},
            postMsg3 = {content: 'Damon post test 3.'};

        // Register a testing user.
        before(function(done) {
            request(app).post(path.user + '/reg')
                .send(registerUser)
                .end(function(err, res) {
                    done();
                });
        });

        // Login
        before(function(done) {
            request(app).post(path.user + '/login')
                .send(loginUser)
                .end(function(err, res) {
                    if (res.body.codeName.should.equal('MSG_SUCCESS_LOGIN')) {
                        cookie = res.headers['set-cookie'].pop().split(';')[0];
                    }
                    done();
                });
        });

        // Post 1 time
        before(function(done) {
            var req = request(app).post(path.post);

            // Set cookie
            req.cookies = cookie;

            req.send(postMsg1).end(function(err, res) {
                (err === null).should.be.true;
                res.body.codeName.should.equal('MSG_POST_SUCCESSFULLY');
                done();
            });

        });

        // Post 2 time
        before(function(done) {
            var req = request(app).post(path.post);

            // Set cookie
            req.cookies = cookie;

            req.send(postMsg2).end(function(err, res) {
                (err === null).should.be.true;
                res.body.codeName.should.equal('MSG_POST_SUCCESSFULLY');
                done();
            });
        });

        it('User only can post 2 times everyday', function(done) {
            var req = request(app).post(path.post);

            // Set cookie
            req.cookies = cookie;

            req.send(postMsg3).end(function(err, res) {
                (err === null).should.be.true;
                res.body.codeName.should.equal('ERR_POST_REACH_TWO_TIMES');
                done();
            });
        });

        // Delete test posts and user.
        // Delete posts
        after(function(done) {
            Post.deleteTodayPostsByUser(registerUser.name, function(err, doc) {
                (err === null).should.be.true;
                done();
            });
        });

        // Delete user
        after(function(done) {
            User.deleteDoc({email: registerUser.email}, function(err, doc) {
                (err === null).should.be.true;
                done();
            });
        });

    });
});
