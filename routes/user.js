
/*
 * GET users listing.
 */

exports.list = function(req, res) {
    res.send("respond with a resource");
};

/**
 * 登录页面
 * @param req
 * @param res
 */
exports.reg = function(req, res) {
    res.render('user/reg', {
        title: '登录'
    });
}