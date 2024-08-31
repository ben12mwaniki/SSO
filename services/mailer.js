var _ = require("lodash");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

var defaultMail = {
  from: "Van Hurri <hurrivan@gmail.com>",
  text: "test text",
};

module.exports.send = function (mail) {
  // use default setting
  mail = _.merge({}, defaultMail, mail);

  // send email
  transporter.sendMail(mail, function (error, info) {
    if (error){
      console.log("mail not sent:", error);
    }else{
      console.log("mail sent:", info.response);
    }
  });
};
