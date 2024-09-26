const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS,
  },
});

const sentForgotPasswordEmail = async ({ email, otp }) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: "Verify your account",
    html: `
        your opt is ${otp}
    `,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error", error);
      throw error;
    }
    console.log("info", info);
    return;
  });
};

const sentTempPassword = async ({ email, tempPassword }) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: "Your Temporary Password",
    html: `
      <p>Hello,</p>
      <p>Your temporary password is: <strong>${tempPassword}</strong></p>
      <p>Please use this password to log in and change your password immediately.</p>
      <p>Thank you!</p>
    `,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error", error);
      throw error;
    }
    console.log("info", info);
    return;
  });
};

module.exports = {
  sentForgotPasswordEmail,
  sentTempPassword,
};
