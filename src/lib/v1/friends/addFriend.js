const FriendRequest = require("@models/FriendRequest");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");
const { sentMessageToTopic } = require("@third-party/firebase");

const addFriend = async ({ friendId, userId }) => {
  if (!friendId) {
    throw error.badRequest("friendId:friendId not provided");
  }

  if (friendId === userId) {
    throw error.badRequest("userId and friendId should not be same");
  }

  const isExist = await FriendRequest.findOne({
    sent_to: friendId,
    sent_by: userId,
  });

  if (isExist) {
    throw error.badRequest("Friend already exist");
  }

  const friendData = new FriendRequest({
    sent_to: friendId,
    sent_by: userId,
  });

  await friendData.save();

  // addFriendToRedisCache(userId, friendId);

  sentMessageToTopic({
    topic: userId,
    title: `New Friend Request`,
    body: `Got a new friend request from a user`,
  });

  deleteKeysWithPrefix("friendRequest:");
  deleteKeysWithPrefix("users:");
  return friendData;
};

module.exports = addFriend;
