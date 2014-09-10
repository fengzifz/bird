/**
 * Created by damon on 14-9-4.
 */

/**
 * 在 terminal 中创建 mongo database：
 * 1. 进入 /usr/local/bin/mongodb/bin
 * 2. 输入：mongod，然后不要关闭这个窗口
 * 3. 然后在另一个 terminal 窗口输入 mongo
 * 这样就可以打开 mongo 的 shell，参考资料：http://stackoverflow.com/questions/13312358/mongo-couldnt-connect-to-server-127-0-0-127017
 *
 *
 * @type {{cookieSecret: string, db: string, host: string}}
 */
module.exports = {
    cookieSecret: 'zaoqila',
    db: 'zaoqila',
    host: 'localhost'
}