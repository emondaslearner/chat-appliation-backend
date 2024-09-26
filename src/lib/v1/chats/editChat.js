const Friend = require("@models/Friend");

const editChat = async ({ userId, friendId, unreadMessage }) => {
  const filter = {
    $or: [
      { first_user: friendId, second_user: userId },
      { first_user: userId, second_user: friendId },
    ],
  };

  const data = await Friend.findOne(filter)
    .populate(
      "first_user",
      "name bio profile_picture updatedAt createdAt status"
    )
    .populate(
      "second_user",
      "name bio profile_picture updatedAt createdAt status"
    );

  if (data) {
    data.unread_message_count = unreadMessage;
    data.save();
    global.io.to(userId).emit("addMessageChatData", data);
  }

  return;
};

module.exports = editChat;
