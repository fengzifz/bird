/**
 * Created by damon on 14-10-4.
 */

require('should');
var request = require('supertest');
var app = require('../../app');
var path = require('../../configs/path_config');
var users = require('../../routes/user');
var msg = require('../../languages/zh_CN');

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



});
