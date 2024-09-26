const FriendRequest = require("@models/FriendRequest");
const { error } = require("@utils");

const getSingleRequest = async ({ friendId, userId }) => {
  if (!friendId || !userId) {
    throw error.badRequest(
      `${!friendId && "friendId:friendId field is missing"}|${
        !userId && "userId:userId field is missing"
      }`
    );
  }

  const data = await FriendRequest.findOne({
    $and: [
      { $or: [{ sent_by: userId }, { sent_by: friendId }] },
      { $or: [{ sent_to: userId }, { sent_to: friendId }] },
    ],
  });

  if (!data) {
    throw error.notFound();
  }

  return data;
};

module.exports = getSingleRequest;
