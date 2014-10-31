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

