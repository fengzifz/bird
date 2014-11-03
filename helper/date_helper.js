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