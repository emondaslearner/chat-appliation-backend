const User = require("@models/User");
const { error } = require("@utils");

const getUser = async ({ id, userId }) => {
  if (!id && !userId) {
    throw error.badRequest("Id is not provided");
  }

  const user = await User.findById(id || userId).select(
    `${id ? "-email" : ""} -password -verified`
  );

  if (!user) {
    throw error.notFound();
  }

  return user._doc ? user._doc : user;
};

module.exports = getUser;
