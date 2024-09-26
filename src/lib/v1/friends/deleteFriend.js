const Friend = require("@models/Friend");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const deleteFriend = async ({ friendId, userId }) => {
  if (!friendId) {
    throw error.badRequest("Friend id not provided");
  }

  if (friendId === userId) {
    throw error.badRequest("userId and friendId should not be same");
  }

  // Find and delete the friendship regardless of its direction
  const deleteData = await Friend.findOneAndDelete({
    $or: [
      { first_user: userId, second_user: friendId },
      { first_user: friendId, second_user: userId },
    ],
  });

  if (deleteData) {
    deleteKeysWithPrefix("friend:");
    // deleteFriendFromRedisCache(userId, friendId);
    return true;
  }

  return false;
};

module.exports = deleteFriend;
