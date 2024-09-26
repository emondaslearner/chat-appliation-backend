const { refreshToken: refreshTokenLib } = require("@lib/v1/auth");

const refreshToken = async (req, res, next) => {
  try {
    const token = await refreshTokenLib(req.body?.token);

    let responseData;
    if (token) {
      responseData = {
        code: 200,
        message: "Refresh token is valid",
        token,
        self: req.url,
        links: {
          signIn: "/auth/sign-in",
        },
      };
    } else {
      responseData = {
        code: 401,
        message: "refresh token is not valid",
      };
    }

    res.status(responseData.code).json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = refreshToken;
