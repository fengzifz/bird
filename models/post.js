/**
 * Created by damon on 14/10/31.
 */

var mongodb = require('./db'),
    dateHelper = require('../helper/date_helper');

/**
 *
 * @param post
 * @constructor
 */
function Post(post) {
    this.post = post;
}

module.exports = Post;

/**
 * Save post
 * @param callback
 */
Post.prototype.save = function save(callback) {
    var post = this.post;

    mongodb.open(function(err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }

        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(post, {safe: true}, function(err, post) {
                mongodb.close();

                if (err) {
                    return callback(err, post);
                }

                callback(null, post);
            });
        });
    });
};

Post.deleteTodayPostsByUser = function deleteTodayPostsByUser(user, callback) {
    var today = dateHelper.getTodayRange(),
        index = {'time': {$gt: today.start, $lt: today.end}, 'name': user};

    mongodb.open(function(err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }

        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findAndRemove(index, function(err, doc) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

/**
 * Get user today post by username
 * @param user
 * @param callback
 */
Post.getTodayPostsByUser = function getTodayPostsByUser(user, callback) {
    var day = dateHelper.getToday(),
        month = dateHelper.getMonth(),
        year = dateHelper.getYear(),
        start = new Date(year, month, day, 0, 0, 0, 0),
        end = new Date(year, month, day + 1, 0, 0, 0, 0),
        index = {'time': {$gt: start, $lt: end}, 'name': user};

    mongodb.open(function(err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }

        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.find(index).toArray(function(err, doc) {

                mongodb.close();

                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });

        });
    });

};

/**
 * Get today posts
 * @param skip
 * @param callback
 */
Post.getTodayPosts = function getTodayPosts(skip, callback) {

    var day = dateHelper.getToday(),
        month = dateHelper.getMonth(),
        year = dateHelper.getYear(),
        start = new Date(year, month, day, 0, 0, 0, 0),
        end = new Date(year, month, day + 1, 0, 0, 0, 0),
        index = {'time': {$gt: start, $lt: end}},
        limit = 20,
        newSkip = skip || limit;

    mongodb.open(function(err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }

        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            // limit: 限制查询数量
            // skip: 跳过多少条查询数量
            collection.find(index, {limit: limit, skip: newSkip}).toArray(function(err, doc) {

                mongodb.close();

                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });

        });
    });
};