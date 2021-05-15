const nodemailer = require("nodemailer");

function email(req, res, next) {
  let transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.SENDGRID_FROM,
    to: req.user.email,
    subject: "Nodemailer Test",
    text: "You have successfully registered",
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs");
    }
    return console.log("Email sent!!!");
  });
  next();
}

module.exports = email;
