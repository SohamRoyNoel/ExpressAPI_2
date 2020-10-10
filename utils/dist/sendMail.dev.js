"use strict";

var nodemailer = require("nodemailer"); // async..await is not allowed in global scope, must use a wrapper


var sendEmail = function sendEmail(options) {
  var transporter, message, info;
  return regeneratorRuntime.async(function sendEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // create reusable transporter object using the default SMTP transport
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_EMAIL,
              // generated ethereal user
              pass: process.env.SMTP_PASSWORD // generated ethereal password

            }
          }); // send mail with defined transport object

          message = {
            from: "".concat(process.env.FROM_NAME, " <").concat(process.env.FROM_EMAIL, ">"),
            to: options.email,
            subject: options.subject,
            text: options.message
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(transporter.sendMail(message));

        case 4:
          info = _context.sent;
          console.log('Message sent: %s', info.messageId);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = sendEmail;