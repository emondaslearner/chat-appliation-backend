const Message = require("@models/Message");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const editMessage = async ({ message, userId, id }) => {
  if (!message && !userId) {
    throw error.badRequest(
      `${!message && "message:message is missing"}|${
        !userId && "userId:userId is missing"
      }`
    );
  }

  const messageData = await Message.findOne({ _id: id, sent_by: userId });

  if (!messageData) {
    throw error.notFound();
  }

  messageData.message = message;

  await messageData.save();

  global.io.to(userId).emit("editMessage", {
    id: userId,
    message,
  });

  deleteKeysWithPrefix("messages:");
  return messageData;
};

module.exports = editMessage
