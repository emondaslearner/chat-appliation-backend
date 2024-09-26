const { editChat: editChatLib } = require("@lib/v1/chats");

const editChat = async (req, res, next) => {
  try {
    await editChatLib({
      userId: req.user.id,
      friendId: req.params.id,
      unreadMessage: req.body?.unreadMessage,
    });

    res.status(200).json({
      code: 200,
      message: "updated",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = editChat;
