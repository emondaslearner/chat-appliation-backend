const {
  addOrCancelReaction: addOrCancelReactionLib,
} = require("@lib/v1/reaction");

const addOrCancelReaction = async (req, res, next) => {
  try {
    const url = req.url;
    const isInclude = url.includes("comment");

    let data = null;
    if (isInclude) {
      data = await addOrCancelReactionLib({
        commentId: req.params.id,
        userId: req.user.id,
        reaction: req.body?.reaction,
      });
    } else {
      data = await addOrCancelReactionLib({
        postId: req.params.id,
        userId: req.user.id,
        reaction: req.body?.reaction,
      });
    }

    const response = {
      code: data === "added" ? 201 : 200,
      message: `${data} reaction successfully`,
      self: req.url,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = addOrCancelReaction;
