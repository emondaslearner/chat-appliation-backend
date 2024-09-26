const Otp = require("@models/Otp");
const User = require("@models/User");
const { error } = require("@utils");
const { sentTempPassword } = require("@third-party/email");
const { hash } = require("@utils");

const verifyOtp = async ({ otp, email }) => {
  if (!otp) {
    throw error.badRequest("otp: otp is not provided");
  }
  if (!email) {
    throw error.badRequest("email: email is not provided");
  }

  const userData = await User.findOne({ email });

  if (!userData) {
    throw error.notFound("Account not found with this email");
  }

  const data = await Otp.findOne({ userId: userData._id, otp });

  if (!data) {
    throw error.badRequest("otp: otp is not valid");
  }

  await Otp.findOneAndDelete({ userId: userData._id, otp });

  // change password
  const tempPass = Math.ceil(Math.random() * 80000000 + 10000000);
  const hashedPassword = await hash.generateHash(`${tempPass}`);

  userData.password = hashedPassword;

  await userData.save();

  await sentTempPassword({ email, tempPassword: tempPass });

  return true;
};

module.exports = verifyOtp;
