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

