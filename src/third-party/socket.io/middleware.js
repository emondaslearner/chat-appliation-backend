const { verifyToken } = require("../token");
const User = require("@models/User");

const authentication = async (socket, next) => {
  const token = socket.handshake.headers.authorization;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const access_token = token.split(" ")[1];

    const verify = await verifyToken({
      token: access_token,
    });

    const user = await User.findOne({ _id: verify?.id });

    if (user && verify) {
      socket.user = user;
      return next();
    }

    return next(new Error("Unauthorized"));
  } catch (err) {
    console.log(err);
    return next(new Error("Unauthorized"));
  }
};

module.exports = { authentication };
