/**
 * Login unit test
 * Created by damon on 14/12/1.
 */

require('should');
var app = require('../../app'),
    request = require('supertest'),
    path = require('../../configs/path_config');

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
        var cookie;

        before(function(done) {
            request(app).post(path.user + '/login')
                .send({'mail': '398846606@qq.com', 'password': '3bSVcm'})
                .end(function(err, res) {

                    if (res.body.code.should.equal(1000)) {
                        cookie = res.headers['set-cookie'].pop().split(';')[0];
                        done();
                    }

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

    it('Wrong password', function(done) {
        request(app).post(path.user + '/login')
            .send({mail: '398846606@qq.com', password: '123123'})
            .end(function(err, res) {
                (err === null).should.be.true;
                res.body.code.should.equal(2);
                done();
            });
    });

    it('Login successfully', function(done) {
        request(app).post(path.user + '/login')
            .send({mail: '398846606@qq.com', password: '3bSVcm'})
            .end(function(err, res) {
                (err === null).should.be.true;
                res.body.code.should.equal(1000);
                done();
            });
    });

});
