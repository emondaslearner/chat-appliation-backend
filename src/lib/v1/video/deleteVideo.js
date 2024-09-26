const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");
const Video = require("@models/Video");

const deleteVideo = async ({ userId, videoId }) => {
  if (!videoId) {
    throw error.badRequest("videoId: videoId is missing");
  }

  const findVideo = await Video.findOne({ user: userId, _id: videoId });

  if (!findVideo) {
    throw error.notFound();
  }

  const deleteV = await Video.findOneAndDelete({
    user: userId,
    _id: videoId,
  });

  deleteKeysWithPrefix("videos:");

  return deleteV;
};

module.exports = deleteVideo;
