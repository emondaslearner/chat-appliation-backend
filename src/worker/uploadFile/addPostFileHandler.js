const Post = require("../../models/Post");
const { parentPort } = require("worker_threads");
const {
  uploadPostPhoto,
  uploadPostVideo,
  calculatePercentagePerFile,
} = require("./commonFunctions");

const addPost = async ({ title, color, photo, video, userId }) => {
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
      "addPost"
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
      "addPost"
    );
  }

  const data = new Post({
    title,
    color,
    photos: photoSchemaIds,
    videos: videoSchemaIds,
    user: userId,
  });

  const savedData = await data.save();

  // socket.to(userId).emit("postUploaded", 100);
  parentPort.postMessage({ userId, percentage: 100, status: "addPost" });

  return savedData;
};

module.exports = {
  addPost,
};
