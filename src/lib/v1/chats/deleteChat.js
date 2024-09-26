const Friend = require("@models/Friend");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const deleteChat = async ({ userId, chatId }) => {
  if (!userId || !chatId) {
    throw error.badRequest(
      `${!userId && "userId:userId is  missing"}|${
        !chatId && "chatId:chatId is missing"
      }`
    );
  }

  const filter = {
    $or: [
      { first_user: chatId, second_user: userId },
      { first_user: userId, second_user: chatId },
    ],
  };

  const chat = await Friend.findOne(filter);
  if (!chat) {
    throw error.notFound();
  }

  chat.chat_deleted_for = [...chat.chat_deleted_for, userId];

  await chat.save();

  deleteKeysWithPrefix("chats:");
  deleteKeysWithPrefix("friends:");
  
  return chat;
};

module.exports = deleteChat;
