/**
 * Created by damon on 14/10/30.
 */

var date = {};

module.exports = date;

/**
 * Get unix timestamp
 * @returns {number}
 */
date.getUnixTime = function getUnixTime() {
    return Math.round(new Date().getTime() / 1000);
};

/**
 * Get unix timestamp by date object
 * @param d
 * @returns {number}
 */
date.getUnixTimeByDate = function getUnixTimeByDate(d) {
    return Math.round(d.getTime() / 1000);
};

/**
 * Get Milli seconds timestamp
 * @returns {number}
 */
date.getMilliSecTime = function getMilliSecTime() {
    return new Date().getTime();
};

/**
 * Get hour by unix timestamp
 * @param unixTime
 * @returns {number}
 */
date.getHour = function getHour(unixTime) {
    var date = new Date(unixTime * 1000);
    return date.getHours();
};

/**
 * Get today
 * @returns {number}
 */
date.getToday = function getToday() {
    var date = new Date();
    return date.getDate();
};

/**
 * Get month
 * JavaScript month's index is from 0 to 11, we must add 1 to make it from 1 to 12
 * @returns {number}
 */
date.getMonth = function getMonth() {
    var date = new Date();
    return date.getMonth() + 1;
};

/**
 * Get year
 * @returns {number}
 */
date.getYear = function getYear() {
    var date = new Date();
    return date.getFullYear();
};

/**
 * Get today range
 * new Date(year, month, day); // The `month` is start at 0
 * @returns {{start: Date, end: Date}}
 */
date.getTodayRange = function getTodayDate() {
    var day = date.getToday(),
        month = date.getMonth(),
        year = date.getYear(),
        start = date.getUnixTimeByDate(new Date(year, month - 1, day, 0, 0, 0, 0)),
        end = date.getUnixTimeByDate(new Date(year, month - 1, day + 1, 0, 0, 0, 0));

    return {
        start: start,
        end: end
    };

};