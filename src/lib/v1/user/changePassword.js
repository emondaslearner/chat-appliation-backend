const User = require("@models/User");
const { error, hash } = require("@utils");

const changePassword = async ({ currentPassword, password, userId }) => {
  if (!currentPassword || !password) {
    throw error.badRequest(
      `${
        !currentPassword && "currentPassword: current password is not provided"
      }|${!password && "password:password is empty"}`
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw error.notFound("User not found");
  }

  const verifyHash = await hash.verifyHash(currentPassword, user.password);

  if (!verifyHash) {
    throw error.badRequest("currentPassword: current password is not valid");
  }

  // hash password
  const hashedPassword = await hash.generateHash(password);
  user.password = hashedPassword;

  await user.save();

  return true;
};

module.exports = changePassword;
