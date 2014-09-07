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

User.prototype.save = function save(callback) {
    var user = {
        name: this.name,
        password: this.password,
        mail: this.mail
    }

    // 连接数据库
    mongodb.open(function(err, db) {
        // 连接出错，丢给 callback 处理
        if (err) {
            return callback(err);
        }

        db.collection('user', function(err, collection) {
            // 出错，关闭数据库，丢给 callback 处理
            if (err) {
                mongodb.close();
                return callback(err);
            }

            // 添加索引
            collection.ensureIndex('mail', {unique: true});

            // 把 user 插入到 document 中
            collection.insert(user, {safe: true}, function(err, user) {
                // 添加成功，关闭数据库，并把结果丢该 callback 处理
                mongodb.close();
                callback(err, user);
            });
        });
    })
}