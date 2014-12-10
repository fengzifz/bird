/**
 * Login unit test
 * Created by damon on 14/12/1.
 */

require('should');
var app = require('../../app'),
    request = require('supertest'),
    path = require('../../configs/path_config'),
    User = require('../../models/user');

describe('Login test: /routes/user.js', function() {

    // Not login
    it('User not login', function(done) {
        request(app).get(path.user + '/checkLogin').end(function(err, res) {
            (err === null).should.be.true;
            res.body.code.should.equal(1001);
            done();
        });
    });

    // Have login
    describe('User have login test case', function() {
        var cookie,
            user = {
                mail: 'ccc@ccc.com',
                name: 'Damon ccc',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

        // Register
        before(function(done) {

            // Register
            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    done();
                });
        });

        // Login and set session
        before(function(done) {
            request(app).post(path.user + '/login')
                .send({'mail': 'ccc@ccc.com', 'password': '1q2w3e4r'})
                .end(function(err, res) {

                    if (res.body.code.should.equal(1000)) {
                        cookie = res.headers['set-cookie'].pop().split(';')[0];
                    }

                    done();
                });
        });

        it('User have login', function(done) {

            var req = request(app).get(path.user + '/checkLogin');

            req.cookies = cookie;

            req.end(function(err, res) {
                (err === null).should.be.true;
                res.body.code.should.equal(1002);
                done();
            });
        });

        after(function(done) {
            User.deleteDoc({mail: 'ccc@ccc.com'}, function(err, doc) {
                done();
            });
        });
    });

    it('No such user', function(done) {
        request(app).post(path.user + '/login')
            .send({mail: 'example@example.com', password: '111111'})
            .end(function(err, res) {
                (err === null).should.be.true;
                res.body.code.should.equal(1);
                done();
            });
    });

    // Wrong password test
    describe('Wrong password test case', function() {

        var user = {
            mail: 'aaa@aaa.com',
            name: 'Damon aaa',
            password: '1q2w3e4r',
            rePassword: '1q2w3e4r'
        };

        // Register a new user
        before(function(done) {
            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    done();
                });
        });

        // Wrong password test
        it('Wrong password', function(done) {
            request(app).post(path.user + '/login')
                .send({mail: 'aaa@aaa.com', password: '111111'})
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.code.should.equal(2);
                    done();
                });
        });

        // Delete test data
        after(function(done) {
            User.deleteDoc({mail: 'aaa@aaa.com'}, function(err, doc) {
                done();
            });
        });
    });

    // Login successfully
    describe('Login successfully test', function() {
        var user = {
            mail: 'bbb@bbb.com',
            name: 'Damon bbb',
            password: '1q2w3e4r',
            rePassword: '1q2w3e4r'
        };

        // Register a new user
        before(function(done) {
            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    done();
                });
        });

        // Login successfully test.
        it('Login successfully', function(done) {
            request(app).post(path.user + '/login')
                .send({mail: 'bbb@bbb.com', password: '1q2w3e4r'})
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.code.should.equal(1000);
                    done();
                });
        });

        // After testing, delete test data
        after(function(done) {
            User.deleteDoc({mail: 'bbb@bbb.com'}, function() {
                done();
            });
        });
    });



});
