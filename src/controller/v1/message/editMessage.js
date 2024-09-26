const {
  editMessage: editMessageLib,
  seenMessage: seenMessageLib,
} = require("@lib/v1/message");

const editMessage = async (req, res, next) => {
  try {
    const message = await editMessageLib({
      id: req.params.id,
      userId: req.user.id,
      message: req.body?.message,
    });

    const response = {
      code: 200,
      message: "message updated successfully",
      data: message,
      self: req.url,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

const seenMessage = async (req, res, next) => {
  try {
    const data = await seenMessageLib({
      userId: req.user.id,
      id: req.params.id,
    });

    const response = {
      code: 200,
      message: "updated",
    };

    res.status(response.code).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { seenMessage, editMessage };
