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

    describe('checkRegisterInfo', function() {

        it('Invalid email', function(done) {

            var user = {
                mail: 'damon.chen',
                name: 'Damon Chen',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            users.checkRegisterInfo(user).should.equal(msg.ERR_INVALID_EMAIL);
            done();
        });

        it('Empty field', function(done) {

            var user = {
                mail: 'damon.chen@damon.com',
                name: '',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            users.checkRegisterInfo(user).should.equal(msg.ERR_SHOULD_ENTER_ALL);
            done();
        });

        it('Username only can use A-Za-z, 0-9 and _', function(done) {

            var user = {
                mail: 'damon.chen@damon.com',
                name: 'damon<',
                password: '1q2w3e4r',
                rePassword: '1q2w3e4r'
            };

            users.checkRegisterInfo(user).should.equal(msg.ERR_INVALID_USERNAME);
            done();
        });

        it('Password must contains number and letter.', function(done) {

            var user = {
                mail: 'damon.chen@damon.com',
                name: 'damon',
                password: '111111',
                rePassword: '111111'
            };

            users.checkRegisterInfo(user).should.equal(msg.ERR_INVALID_PASSWORD);
            done();
        });

        it('Not match re-password', function(done) {

            var user = {
                mail: 'damon.chen@damon.com',
                name: 'Damon chen',
                password: '1q2w3e4r',
                rePassword: '2w1q3e4r'
            };

            //console.log(users.checkRegisterInfo(user));

            users.checkRegisterInfo(user).should.equal(msg.ERR_NOT_SAME_PASSWORD);
            done();
        });

    });

});
