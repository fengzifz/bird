/**
 * Created by damon on 14-10-4.
 */

var request = require('supertest');
var should = require('should');
var app = require('../app');

describe('routes/user.js', function() {

    // Register page
    it ('/reg/ should 200', function(done) {
        request(app).get('/reg/').end(function(err, res) {
            res.statusCode.should.equal(200);
            done(err);
        });
    });


});
