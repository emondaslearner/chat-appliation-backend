const Post = require("../../models/Post");
const { parentPort } = require("worker_threads");
const {
  uploadPostPhoto,
  uploadPostVideo,
  calculatePercentagePerFile,
} = require("./commonFunctions");

const updatePost = async ({
  title,
  color,
  photo,
  video,
  userId,
  postId,
  existingFilesIds,
}) => {
  let perVideoPercentage;
  let perPhotoPercentage;
  if (photo.length || video.length) {
    const { photoPercentage, videoPercentage } =
      await calculatePercentagePerFile(photo.length, video.length);
    perVideoPercentage = videoPercentage;
    perPhotoPercentage = photoPercentage;
  }

  // upload photo
  let photoSchemaIds = [];
  if (photo.length) {
    photoSchemaIds = await uploadPostPhoto(
      photo,
      userId,
      perPhotoPercentage,
      "updatePost"
    );
  }

  // upload video
  let videoSchemaIds = [];
  if (video.length) {
    videoSchemaIds = await uploadPostVideo(
      video,
      userId,
      perVideoPercentage,
      perPhotoPercentage * photo.length,
      "updatePost"
    );
  }

  const updateFields = {};

  if (title) updateFields.title = title;
  if (color) updateFields.color = color;
  if (photo.length)
    updateFields.photos = [...existingFilesIds, ...photoSchemaIds];
  if (video.length) updateFields.videos = videoSchemaIds;

  const data = await Post.findOneAndUpdate(
    { _id: postId, user: userId },
    updateFields,
    {
      new: true,
    }
  );

  // socket.to(userId).emit("postUploaded", 100);
  parentPort.postMessage({ userId, percentage: 100, status: "updatePost" });

  return data;
};

module.exports = {
  updatePost,
};
