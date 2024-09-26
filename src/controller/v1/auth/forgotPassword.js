const { forgotPassword: forgotPasswordLib } = require("@lib/v1/auth");

const forgotPassword = async (req, res, next) => {
  try {
    await forgotPasswordLib({ email: req.body.email });

    const response = {
      code: 200,
      message: "Otp sent to user successfully",
      self: req.url,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = forgotPassword
