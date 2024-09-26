const Friend = require("@models/Friend");
const { error } = require("@utils");

const getSingleFriend = async ({ userId, friendId }) => {
  if (!friendId) {
    throw error.badRequest("friendId:friendId not provided");
  }

  if (friendId === userId) {
    throw error.badRequest("userId and friendId should not be same");
  }

  const isExist = await Friend.findOne({
    $or: [
      { first_user: userId, second_user: friendId },
      { first_user: friendId, second_user: userId },
    ],
  })
    .populate("first_user")
    .populate("second_user");

  if (!isExist) {
    throw error.notFound();
  }

  return isExist;
};

module.exports = getSingleFriend;
