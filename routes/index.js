
/*
 * GET home page.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.json({title: 1, time: new Date()});
    //res.render('index', {
    //    title: '早起啦',
    //    time: new Date()
    //});
});

module.exports = router;