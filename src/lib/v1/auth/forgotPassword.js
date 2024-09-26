const { error } = require("@utils");
const User = require("@models/User");
const Otp = require("@models/Otp");
const { sentForgotPasswordEmail } = require("@third-party/email");

const forgotPassword = async ({ email }) => {
  if (!email) {
    throw error.badRequest(`${!email && "email: email not provided"}`);
  }

  const data = await User.findOne({ email });
  if (!data) {
    throw error.notFound("Do not exist account via this email");
  }

  const otp = Math.ceil(Math.random() * 800000 + 100000);

  const otpData = new Otp({
    userId: data._id,
    otp,
  });

  await otpData.save();

  const sentEmail = await sentForgotPasswordEmail({ email, otp });

  return sentEmail;
};

module.exports = forgotPassword;
