const { deletePost: deletePostLib } = require("@lib/v1/post");

const deletePost = async (req, res, next) => {
  try {
    await deletePostLib({ userId: req.user.id, postId: req.params?.id });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = deletePost;
