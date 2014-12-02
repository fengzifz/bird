/**
 * Created by damon on 14-10-4.
 */

require('should');
var request = require('supertest'),
    app = require('../../app'),
    path = require('../../configs/path_config'),
    users = require('../../routes/user'),
    User = require('../../models/user.js');

describe('post routes/user.js', function() {

    // Check Register information
    describe('checkRegisterInfo', function() {

        it('Invalid email', function(done) {

            var user = {
                mail: 'damon.chen',
                name: 'Damon Chen',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.code.should.equal(4);
                    done();
                });

        });

        it('Empty field', function(done) {

            var user = {
                mail: 'damon.chen@damon.com',
                name: '',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.code.should.equal(8);
                    done();
                });

        });

        it('Username only can use A-Za-z, 0-9 and _', function(done) {

            var user = {
                mail: 'damon.chen@damon.com',
                name: 'damon<',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.code.should.equal(5);
                    done();
                });

        });

        it('Password must contains number and letter.', function(done) {

            var user = {
                mail: 'damon.chen@damon.com',
                name: 'damon',
                password: '111111',
                rePassword: '111111'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.code.should.equal(6);
                    done();
                });

        });

        it('Not match re-password', function(done) {

            var user = {
                mail: 'damon.chen@damon.com',
                name: 'Damon chen',
                password: '1q2w3e4r',
                rePassword: '2w1q3e4r'
            };

            request(app).post(path.user + '/reg')
                .send(user)
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.code.should.equal(7);
                    done();
                });

        });

    });

    // TODO: Register unit test
    describe('Register /user/reg', function() {

        // User have already exist
        // 1. Register a new user
        // 2. Use the email to register again
        // 3. After testing, delete the user
        describe('The mail have already exist', function() {
            var user = {
                mail: 'example@example.com',
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
                        res.body.code.should.equal(9);
                        done();
                    });
            });

            after(function(done) {
                User.deleteDoc({mail: 'example@example.com'}, function(err, doc) {
                    done();
                });
            });

        });

        // Register successfully
        // 1. Register a new user
        // 2. After testing, delete the user
    });



});
