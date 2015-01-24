/**
 * Created by damon on 14/10/22.
 */

var should = require('should');
var mail = require('../configs/mail');
var MailHelper = require('../helper/mail_helper');

describe('Send email', function() {

    // 发送注册邮件
    describe('Send register mail', function() {

        it('Send successfully', function(done) {

            var user = {
                email: 'chenzifeng2012@gmail.com',
                name: 'Damon Chen',
                type: 'reg'
            };

            var mailHelper = new MailHelper(user);

            mailHelper.send(function(err) {

                (err === null).should.be.true;

                done();
            });

        });

    });

    // 发送忘记密码邮件
    describe('Send forget password mail', function() {

        it('Send successfully', function(done) {

            var user = {
                email: 'chenzifeng2012@gmail.com',
                name: 'Damon Chen',
                password: '1q2w3e',
                type: 'fgt'
            };

            var mailHelper = new MailHelper(user);

            mailHelper.send(function(err) {
                (err === null).should.be.true;

                done();
            });

        });

    });

});

