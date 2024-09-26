const FriendRequest = require("@models/FriendRequest");
const Friend = require("@models/Friend");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");
const { sentMessageToTopic } = require("@third-party/firebase");

const acceptRequest = async ({ userId, friendId }) => {
  if (!userId || !friendId) {
    throw error.badRequest("id:id not provided");
  }

  if (userId === friendId) {
    throw error.badRequest("userId and friendId should not be same");
  }

  const data = await FriendRequest.findOne({
    sent_by: friendId,
    sent_to: userId,
  });

  if (!data) {
    throw error.notFound();
  }

  const friendData = new Friend({
    first_user: userId,
    second_user: friendId,
  });

  await friendData.save();

  await FriendRequest.findOneAndDelete({
    sent_by: friendId,
    sent_to: userId,
  });

  sentMessageToTopic({
    topic: friendId,
    title: `A user accepted your friend request`,
    body: `New friend added to your friend list. A user accepted your friend request`,
  });
  
  deleteKeysWithPrefix("friend:");
  deleteKeysWithPrefix("friendRequest:");
  return friendData;
};

module.exports = acceptRequest;
