const nodemailer = require("nodemailer")

const smtp = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
        user: 'ettie49@ethereal.email',  //change this user and pass with new data from ethereal email web
        pass: 'tKxwC8NBXhQ1z7mw95'
  }
});

module.exports = smtp