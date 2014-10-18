/**
 * Created by damon on 14/10/18.
 */

var nodemailer = require('nodemailer');

var adminMail = 'zaoqila_bird@126.com';

// create reusable transporter object using SMTP transport
exports.transporter = nodemailer.createTransport({
    host: 'smtp.126.com',
    port: 25,
    auth: {
        user: adminMail,
        pass: 'fengzifz'
    }
});

// setup e-mail data with unicode symbols
exports.mailOptionsReg = {
    from: '早起啦<' + adminMail + '>', // sender address
    to: '', // list of receivers
    subject: '注册成功', // Subject line
    html: 'Hi zaoqila_user, <br/>您已经成功注册<a target="_blank" href="http://zaoqi.la">早起啦</a>，' +
        '马上<a href="http://zaoqi.la/user/login" target="_blank">登录</a>。<br /><br />' +
        'Best Regards,<br />' +
        'Zao Qi La'
};