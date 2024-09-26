const { deleteChat: deleteChatLib } = require("@lib/v1/chats");

const deleteChat = async (req, res, next) => {
  try {
    const chat = await deleteChatLib({
      chatId: req.params.id,
      userId: req.user.id,
    });

    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

module.exports = deleteChat;
