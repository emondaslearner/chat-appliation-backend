const { updatePost: updatePostLib } = require("@lib/v1/post");

const updatePost = async (req, res, next) => {
  try {
    const photo = req.files?.photo;
    const video = req.files?.video;

    const updateData = {
      color: req.body?.color,
      title: req.body?.title,
      photo: photo ? photo : [],
      video: video ? video : [],
      existingFilesIds: JSON.parse(req.body?.existingFilesIds),
    };

    await updatePostLib({
      userId: req.user.id,
      postId: req.params.id,
      updateData,
    });

    const response = {
      code: 200,
      message:
        "Post will update soon. after processing the post we will notify you",
      self: req.url,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = updatePost;
