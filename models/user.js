/**
 * Created by damon on 14-9-7.
 */

var mongodb = require('./db');

/**
 * User 类
 * @param user
 * @constructor
 */
function User(user) {

    // 新建 user 时，才需要 name，password，mail
    // 更新 user 时，只有 mail 是必须的，name 和 password 是选填
    this.user = user;
}

// 输出模块
module.exports = User;

/**
 * Delete document
 * @param index
 * @param callback
 */
User.deleteDoc = function deleteDoc(index, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findAndRemove(index, function(err, doc) {

                mongodb.close();

                if (err) {
                    return callback(err);
                }

                return callback(null, doc);
            });

        });
    });
};

/**
 * Get index from database
 * @param index
 * @param callback
 */
User.get = function get(index, callback) {
    mongodb.open(function(err, db) {

        if (err) {
            mongodb.close();
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne(index, function(err, doc) {

                mongodb.close();

                if (doc) {
                    var user = new User(doc);
                    return callback(null, user);
                }

                return callback(err, null);
            });
        });
    });
};


/**
 * 保存用户到数据库
 * @param callback
 */
User.prototype.save = function save(callback) {
    var user = this.user;

    // 连接数据库
    mongodb.open(function(err, db) {
        // 连接出错，丢给 callback 处理
        if (err) {
            db.close();
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            // 出错，关闭数据库，丢给 callback 处理
            if (err) {
                mongodb.close();
                return callback(err);
            }

            /**
             * Mongo 2.4.9，添加索引时，需要添加回调函数
             */
            // 添加 mail 索引，email 唯一的
            collection.ensureIndex('mail', {unique: true}, function() {});

            // 把 user 插入到 document 中
            collection.insert(user, {safe: true}, function(err, user) {
                // 添加成功，关闭数据库，并把结果丢该 callback 处理
                mongodb.close();

                if (err) {
                    return callback(err, user);
                }

                callback(null, user);
            });
        });
    })
};

/**
 * 更新用户
 * @param index 例如：{mail: xxx}
 * @param callback
 */
User.prototype.update = function update(index, callback) {

    var user = this.user;

    mongodb.open(function(err, db) {

        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            // 更新
            collection.update(index, user, {w: 1}, function(err) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }

                mongodb.close();

                callback(null);
            });
        });
    });
};
