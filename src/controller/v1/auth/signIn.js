const { signIn: signInLib } = require("@lib/v1/auth");

const signIn = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    const {token, userData} = await signInLib(data);

    const responseData = {
      code: 200,
      message: "Successfully logged in",
      token,
      self: req.user,
      links: {
        user: `/user/${userData.id}`,
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = signIn;
