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
    this.name = user.name;
    this.password = user.password;
    this.mail = user.mail;
}

// 输出模块
module.exports = User;

/**
 * Get index from database
 * @param index
 * @param callback
 */
User.get = function get(index, callback) {
    // TODO: Get index from database
    mongodb.open(function(err, db) {

        if (err) {
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
    var user = {
        name: this.name,
        password: this.password,
        mail: this.mail
    };

    // 连接数据库
    mongodb.open(function(err, db) {
        // 连接出错，丢给 callback 处理
        if (err) {
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