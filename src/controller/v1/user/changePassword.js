const { changePassword: changePasswordLib } = require("@lib/v1/user");

const changePassword = async (req, res, next) => {
  try {
    await changePasswordLib({
      currentPassword: req.body?.currentPassword,
      password: req.body?.password,
      userId: req.user.id,
    });

    const response = {
      code: 200,
      message: "Changed password successfully",
      self: req.url,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = changePassword;
