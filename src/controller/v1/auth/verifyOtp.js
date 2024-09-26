const { verifyOtp: verifyOtpLib } = require("@lib/v1/auth");

const verifyOtp = async (req, res, next) => {
  try {
    await verifyOtpLib({ otp: req.body?.otp, email: req.body?.email });

    const response = {
      code: 200,
      message: "Otp verified successfully",
      self: req.url,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = verifyOtp;
