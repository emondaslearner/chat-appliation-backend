const { deleteComment: deleteCommentLib } = require("@lib/v1/comment");

const deleteComment = async (req, res, next) => {
  try {
    await deleteCommentLib({ id: req.params?.id, userId: req.user.id });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = deleteComment;
