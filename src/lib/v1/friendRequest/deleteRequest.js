const FriendRequest = require("@models/FriendRequest");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const deleteRequest = async ({ userId, friendId }) => {
  if (!userId || !friendId) {
    throw error.badRequest("id:id not provided");
  }

  if (userId === friendId) {
    throw error.badRequest("userId and friendId should not be same");
  }

  const gotData = await FriendRequest.findOne({
    $and: [
      { $or: [{ sent_by: userId }, { sent_by: friendId }] },
      { $or: [{ sent_to: userId }, { sent_to: friendId }] },
    ],
  });

  if (!gotData) {
    throw error.notFound();
  }

  const data = await FriendRequest.findOneAndDelete({
    $and: [
      { $or: [{ sent_by: userId }, { sent_by: friendId }] },
      { $or: [{ sent_to: userId }, { sent_to: friendId }] },
    ],
  });

  deleteKeysWithPrefix("friendRequest:");
  deleteKeysWithPrefix("users:");

  return data;
};

module.exports = deleteRequest;
