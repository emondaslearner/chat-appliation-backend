const { updateComment: updateCommentLib } = require("@lib/v1/comment");

const updateComment = async (req, res, next) => {
  try {
    const comment = await updateCommentLib({
      body: req.body?.message,
      id: req.params?.id,
      userId: req.user.id,
    });

    const response = {
      code: 200,
      message: "Updated comment successfully",
      data: comment,
      self: req.url,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = updateComment;
