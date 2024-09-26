const { deleteMessage: deleteMessageLib } = require("@lib/v1/message");

const deleteMessage = async (req, res, next) => {
  try {
    const data = await deleteMessageLib({
      status: req.query?.status,
      id: req.params.id,
      userId: req.user.id,
    });

    res.status(200).json({ code: 200, message: "deleted successfully", data });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteMessage;
