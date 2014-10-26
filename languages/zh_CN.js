/**
 * Created by damon on 14-8-28.
 * 语言包
 */

var zh_CN = {
    REGISTER: '注册',
    LOGIN: '登录',
    FORGET: '忘记密码',

    // Error message
    ERR_SHOULD_ENTER_ALL: '请填写全部信息',
    ERR_INVALID_EMAIL: '错误的邮箱格式',
    ERR_INVALID_USERNAME: '用户名只能使用字母、数字和下划线',
    ERR_INVALID_SHORT_PWD: '密码长度必须6位',
    ERR_INVALID_PASSWORD: '密码必须包含数字和字母',
    ERR_NOT_SAME_PASSWORD: '两次输入的密码必须一致',
    ERR_SAVE_FAIL: '保存出错',
    ERR_DUPLICATE_EMAIL: 'email 已经被使用',
    ERR_SMTP: 'SMTP 出错，请重试',
    ERR_SEND_MAIL_FAIL: '发送邮件失败',

    // Login error message
    ERR_USER_NOT_FOUND: '用户不存在',
    ERR_PASSWORD_WRONG: '密码错误',

    // Successfully message
    SUCCESS_REGISTER: '注册成功',
    SUCCESS_LOGIN: '登录成功',
    SUCCESS_HAVE_LOGIN: '已经登录',
    SUCCESS_NOT_LOGIN: '请先登录',
    SUCCESS_LOGOUT: '已经退出',
    SUCCESS_NEW_PWD: '新的密码已经发送到您的邮箱，请查收'
};

module.exports = zh_CN;
