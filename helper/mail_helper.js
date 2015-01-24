/**
 * Created by damon on 14/10/22.
 */

var mail = require('../configs/mail');

function Mail(opt) {
    this.opt = opt;
}

module.exports = Mail;

Mail.prototype.send = function send(callback) {

    var type = this.opt.type,
        opt;

    if (type == 'reg') {
        mail.mailOptReg.to = this.opt.email;
        mail.mailOptReg.html = mail.mailOptReg.html.replace(/zaoqila_user/, this.opt.name);

        opt = mail.mailOptReg;
    } else if (type == 'fgt') {
        mail.mailOptFgt.to = this.opt.email;
        mail.mailOptFgt.html = mail.mailOptFgt.html.replace(/zaoqila_user/, this.opt.name);
        mail.mailOptFgt.html = mail.mailOptFgt.html.replace(/zaoqila_password/, this.opt.password);

        opt = mail.mailOptFgt;
    }

    mail.transporter.sendMail(opt, function(err) {
        callback(err);
    });

};