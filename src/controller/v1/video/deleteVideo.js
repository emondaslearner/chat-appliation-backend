const { deleteVideo: deleteVideoLib } = require("@lib/v1/video");

const deleteVideo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isDeleted = await deleteVideoLib({
      videoId: req.params?.id,
      userId,
    });

    if (isDeleted) {
      res.status(204).end();
      return;
    }

    throw error.notFound();
  } catch (err) {
    next(err);
  }
};

module.exports = deleteVideo;
