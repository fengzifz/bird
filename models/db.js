/**
 * Created by damon on 14-9-4.
 */

var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

/**
 * {w:1}: 标志符，用来保证在调用提供给数据库操作的回调函数之前，数据库已经成功写入
 * poolSize: 参数的值可以用来调整 MongoDB 服务器同时的连接个数
 * @type {Db}
 */
module.exports = new Db(
    settings.db,
    new Server(
        settings.host,
        Connection.DEFAULT_PORT,
        {safe: true, auto_reconnect: true, poolSize: 20}
    ),
    {w: 1}
);