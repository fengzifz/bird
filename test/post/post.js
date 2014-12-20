/**
 * Created by damon on 14/10/26.
 */

var should = require('should'),
    request = require('supertest'),
    app = require('../../app'),
    path = require('../../configs/path_config'),
    user = require('../../routes/user'),
    post = require('../../routes/'),
    User = require('../../models/user');

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
                mail: 'aaa@aaa.com',
                name: 'Damon aaa',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            },
            loginUser = {
                mail: registerUser.mail,
                password: registerUser.password
            },
            postMsg = {content: 'Damon post test'};

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
                    if (res.body.code.should.equal(1000)) {
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
                res.body.code.should.equal(1005);
                done();
            });

        });

        // After testing, delete test data, including test account and test post.
        // Notice: Name / email is unique when user register, so we can delete post by username
        // Delete post
        after(function(done) {
            request(app).post(path.post + '/deleteTodayPostByName')
                .send(registerUser)
                .end(function(done) {
                    done();
                });
        });

        // Delete user
        after(function(done) {
            User.deleteDoc({mail: registerUser.mail}, function(err, doc) {
                 done();
            });
        });

    });

    // TODO: User only can post 2 times everyday
    describe('User only can post 2 times everyday', function() {
        var cookie,
            registerUser = {
                email: 'damon@damon.com',
                name: 'Damon chen',
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
                    if (res.body.code.should.equal(1000)) {
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
                res.body.code.should.equal(1005);
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
                res.body.code.should.equal(1005);
                done();
            });
        });

        it('User only can post 2 times everyday', function(done) {
            var req = request(app).post(path.post);

            // Set cookie
            req.cookies = cookie;

            req.send(postMsg3).end(function(err, res) {
                (err === null).should.be.true;
                res.body.code.should.equal(11);
                done();
            });
        });

        // Delete test posts and user.
        // Delete posts
        after(function(done) {
            request(app).post(path.post + '/deleteTodayPostByName')
                .end(function(err, res) {
                    done();
                });
        });

        // Delete user
        after(function(done) {
            User.deleteDoc({mail: loginUser.mail}, function(err, res) {
                done();
            });
        });

    });
});
