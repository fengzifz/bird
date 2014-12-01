/**
 * Created by damon on 14/10/26.
 */

var codes = {

    // Error code
    0: 'ERR_DATABASE',
    1: 'ERR_USER_NOT_FOUND',
    2: 'ERR_PASSWORD_WRONG',
    3: 'ERR_MUST_ENTER_ALL',
    4: 'ERR_INVALID_EMAIL',
    5: 'ERR_INVALID_USERNAME',
    6: 'ERR_INVALID_PASSWORD',
    7: 'ERR_RE_PASSWORD_NOT_SAME',
    8: 'ERR_MUST_ENTER_ALL',
    9: 'ERR_MAIL_HAVE_EXIST',
    10: 'ERR_SEND_MAIL_FAIL',
    403: 'ERR_AUTHORIZATION_FAIL',

    // Message code
    1000: 'MSG_SUCCESS_LOGIN',
    1001: 'MSG_NOT_LOGIN',
    1002: 'MSG_HAVE_LOGIN',
    1003: 'MSG_REGISTER_SUCCESSFULLY',

    // Mongo DB err
    11000: 'ERR_DUPLICATE_KEY',

    // Mail server err
    9000: 'ERR_MAIL_SERVER'
};

module.exports = codes;