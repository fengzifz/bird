/**
 * Created by damon on 14/11/8.
 */

var codes = require('../configs/codes');
var lang = require('../languages/zh_CN');

module.exports = {

    /**
     * 根据 code，返回对应的 error name 和 description
     * @param code
     * @returns {{error: *, description: *}}
     */
    outputMsg: function(code) {
        var codeName = codes[code],
            error = false,
            desc;

        // Check error message or not
        if (codeName.match(/ERR_/)) {
            error = true;
        }

        // Get message
        if (error) {
            desc = lang.error[codeName];
        } else {
            desc = lang.message[codeName];
        }

        return {
            code: code,
            codeName: codeName,
            error: error,
            description: desc
        };
    }

};

