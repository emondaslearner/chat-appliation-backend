const Friend = require("@models/Friend");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const blockFriend = async ({ friendId, userId, block }) => {
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
  });

  if (!isExist) {
    throw error.notFound("friend not exist");
  }

  if (block) {
    isExist.blocked = true;
    isExist.blocked_by = userId;
  } else {
    isExist.blocked = false;
    isExist.blocked_by = null;
  }

  await isExist.save();

  // deleteFriendFromRedisCache(userId, friendId);

  deleteKeysWithPrefix("friend:");

  return isExist;
};

module.exports = blockFriend;
