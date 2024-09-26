const User = require("@models/User");
const { verifyToken } = require("@third-party/token");

const authenticate = async (req, res, next) => {
  const getToken = req.headers?.authorization || req.cookies?.bearer_token;

  if (!getToken) {
    res.status(401).json({
      code: 401,
      message: "Authentication Failed",
    });
    return;
  }

  const tokens = getToken.split(" ");

  const accessToken = tokens[tokens.length - 2];
  const refreshToken = tokens[tokens.length - 1];

  try {
    const tokenInformation = await verifyToken({ token: accessToken });
    if (!tokenInformation) {
      throw new Error("authenticate");
    }

    const user = await User.findById(tokenInformation.id);
    if (!user) {
      res.status(404).json({
        code: 404,
        message: "User Account not exist",
      });
      return;
    }

    req.user = {
      id: tokenInformation.id,
    };

    next();
  } catch (err) {
    try {
      const checkRefreshToken = await verifyToken({
        token: refreshToken,
      });

      if (checkRefreshToken) {
        res.status(401).json({
          code: 401,
          message: "Access token is not valid. Please request new access token",
          data: {
            refresh_token,
          },
          self: req.url,
          link: "/auth/refresh",
        });
        return;
      }
    } catch (e) {
      res.status(401).json({
        code: 401,
        message: "Authentication Failed",
      });
      return;
    }
  }
};

module.exports = authenticate;
