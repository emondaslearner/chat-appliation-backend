const { addComment: addCommentLib } = require("@lib/v1/comment");

const addComment = async (req, res, next) => {
  try {
    const payload = {
      body: req.body?.message,
      postId: req.body?.postId,
      userId: req.user.id,
      path: req.body?.path,
      parent: req.body?.parent,
    };

    const data = await addCommentLib(payload);

    const response = {
      code: 201,
      message: "Comment added successfully",
      data,
      self: req.url,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = addComment;
