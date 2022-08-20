var _ = require("lodash");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hurrivan@gmail.com",
    pass: "swmyflgjddluxcqn",
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
    if (error) return console.log(error);
    console.log("mail sent:", info.response);
  });
};
