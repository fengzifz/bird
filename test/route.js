/**
 * Created by damon on 14-10-4.
 */

var request = require('supertest');
var should = require('should');
var app = require('../app');
var path = require('../configs/path_config');

describe('routes/user.js', function() {

    // Register page
    it ('Register page: /reg/ should 200', function(done) {
        request(app).get(path.reg).end(function(err, res) {
            res.statusCode.should.equal(200);
            done(err);
        });
    });

    // Homepage
    it ('Homepage: / should 200', function(done) {
        request(app).get(path.home).end(function(err, res) {
            res.statusCode.should.equal(200);
            done(err);
        });
    });

});
