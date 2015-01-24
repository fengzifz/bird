/**
 * Forget password unit testing
 * Created by damon on 14/12/2.
 */

require('should');
var request = require('supertest'),
    app = require('../../app'),
    path = require('../../configs/path_config'),
    User = require('../../models/user');

describe('Forget password unit test: /routes/user.js', function() {

    // Invalid mail
    it('Invalid mail', function(done) {
        request(app).post(path.user + '/forget')
            .send({email: 'NotMail'})
            .end(function(err, res) {
                (err === null).should.be.true;
                res.body.codeName.should.equal('ERR_INVALID_EMAIL');
                done();
            });
    });

    // Mail not found
    it('Mail not found', function(done) {
        request(app).post(path.user + '/forget')
            .send({email: 'example@notFound.com'})
            .end(function(err, res) {
                (err === null).should.be.true;
                res.body.codeName.should.equal('ERR_USER_NOT_FOUND');
                done();
            });
    });

    // Send new password successfully
    describe('Send new password successfully test case', function() {
        var user = {
            email: '398846606@qq.com',
            name: 'Damon mail test',
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

        // Test
        it('Send new password successfully', function(done) {
            request(app).post(path.user + '/forget')
                .send({email: user.email})
                .end(function(err, res) {
                    (err === null).should.be.true;
                    res.body.codeName.should.equal('MSG_SEND_NEW_PASSWORD');
                    done();
                });
        });

        // Delete test data after testing
        after(function(done) {
            User.deleteDoc({email: user.email}, function(err, doc) {
                done();
            });
        });
    });

});