const { signUp: signUpLib } = require("@lib/v1/auth");

const signUp = async (req, res, next) => {
  try {
    const { name, email, dateOfBirth, password } = req.body;

    const data = {
      name,
      email,
      dateOfBirth,
      password,
    };

    const { token, savedData } = await signUpLib(data);

    const responseData = {
      code: 201,
      message: "Successfully created account",
      token,
      self: req.url,
      links: {
        user: `/user/${savedData.id}`,
      },
    };

    res.status(201).json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = signUp;
