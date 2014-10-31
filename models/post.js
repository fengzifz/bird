/**
 * Created by damon on 14/10/31.
 */

var mongodb = require('./db');

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

        db.collection('posts', function(err,collection) {
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

Post.get = function get(index, callback) {

};