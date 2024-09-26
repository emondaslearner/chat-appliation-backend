const { generateToken, verifyToken } = require("@third-party/token");
const { error } = require("@utils");

const refreshToken = async (reqToken) => {
  try {
    if (!reqToken) {
      error.badRequest("Token not provided");
    }

    const tokens = reqToken.split(" ");

    const refreshToken = tokens[tokens.length - 1];

    const isTokenValid = await verifyToken({ token: refreshToken });

    if (isTokenValid) {
      const newToken = await generateToken({
        data: {
          id: isTokenValid.id,
        },
        expireAt: process.env.ACCESS_EXPIRE_TIME,
      });

      return `Bearer ${newToken} ${refreshToken}`;
    }

    return false;
  } catch (err) {
    return false;
  }
};

module.exports = refreshToken;
