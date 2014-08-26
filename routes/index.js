
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', {
        title: '早起啦',
        time: new Date()
    });
};