const jwt = require("jsonwebtoken");

const generateToken = async ({
  data,
  expireAt = process.env.REFRESH_EXPIRE_TIME,
  privateKey = process.env.TOKEN_SECRET,
}) => {
  const token = await jwt.sign(data, privateKey, {
    expiresIn: expireAt,
  });

  return token;
};

const verifyToken = async ({
  token,
  privateKey = process.env.TOKEN_SECRET,
}) => {
  const decoded = await jwt.verify(token, privateKey);

  return decoded;
};

module.exports = { generateToken, verifyToken };
