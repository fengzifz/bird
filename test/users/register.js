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

        var user = {
            email: 'damon.chen',
            name: 'Damon Chen',
            password: 111111,
            rePassword: 111111
        };

        it('Invalid email', function(done) {
            users.checkRegisterInfo(user).message.should.equal(msg.ERR_INVALID_EMAIL);
            done();
        });

    });

});
