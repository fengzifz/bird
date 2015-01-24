/**
 * Created by damon on 14-10-4.
 */

require('should');
var request = require('supertest'),
    app = require('../../app'),
    path = require('../../configs/path_config'),
    users = require('../../routes/user'),
    User = require('../../models/user.js');

describe('Register unit test: routes/user.js', function() {

    // Check Register information
    describe('checkRegisterInfo', function() {

        it('Invalid email', function(done) {

            var user = {
                email: 'damon.chen',
                name: 'Damon Chen',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.codeName.should.equal('ERR_INVALID_EMAIL');
                    done();
                });

        });

        it('Empty field', function(done) {

            var user = {
                email: 'damon.chen@damon.com',
                name: '',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.codeName.should.equal('ERR_MUST_ENTER_ALL');
                    done();
                });

        });

        it('Username only can use A-Za-z, 0-9 and _', function(done) {

            var user = {
                email: 'damon.chen@damon.com',
                name: 'damon<',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.codeName.should.equal('ERR_INVALID_USERNAME');
                    done();
                });

        });

        it('Password must contains number and letter.', function(done) {

            var user = {
                email: 'damon.chen@damon.com',
                name: 'damon',
                password: '111111',
                rePassword: '111111'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.codeName.should.equal('ERR_INVALID_PASSWORD');
                    done();
                });

        });

        it('Not match re-password', function(done) {

            var user = {
                email: 'damon.chen@damon.com',
                name: 'Damon chen',
                password: '1q2w3e4r',
                rePassword: '2w1q3e4r'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.codeName.should.equal('ERR_RE_PASSWORD_NOT_SAME');
                    done();
                });

        });

    });

    // Register unit test
    describe('Register /user/reg', function() {

        // User have already exist
        // 1. Register a new user
        // 2. Use the email to register again
        // 3. After testing, delete the user
        describe('The mail have already exist', function() {
            var user = {
                email: 'example@example.com',
                name: 'Damon Testing',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            before(function(done) {
                request(app).post(path.user + '/reg')
                    .send(user)
                    .end(function(err, res) {
                        // Register successfully
                        done();
                    });
            });

            it('The mail have already exist', function(done) {
                request(app).post(path.user + '/reg')
                    .send(user)
                    .end(function(err, res) {
                        (err === null).should.be.true;
                        res.body.codeName.should.equal('ERR_MAIL_HAVE_EXIST');
                        done();
                    });
            });

            after(function(done) {
                User.deleteDoc({email: 'example@example.com'}, function(err, doc) {
                    done();
                });
            });

        });

        // Register successfully
        // 1. Register a new user
        // 2. After testing, delete the user
        describe('Register successfully', function() {
            var user = {
                email: 'example@example.com',
                name: 'Damon',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            it('Register successfully', function(done) {
                request(app).post(path.user + '/reg')
                    .send(user)
                    .end(function(err, res) {
                        (err === null).should.be.true;
                        res.body.codeName.should.equal('MSG_REGISTER_SUCCESSFULLY');
                        done();
                    });
            });

            after(function(done) {
                User.deleteDoc({email: 'example@example.com'}, function(err, doc) {
                    done();
                });
            });
        });


    });



});
