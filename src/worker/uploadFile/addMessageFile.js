const { parentPort } = require("worker_threads");
const {
  uploadPostPhoto,
  uploadPostVideo,
  calculatePercentagePerFile,
} = require("./commonFunctions");
const Message = require("../../models/Message");

function separateFiles(files) {
  const videoExtensions = [".mp4", ".mkv", ".avi", ".mov"];
  const pictureExtensions = [".jpg", ".jpeg", ".png", ".gif"];

  const videos = [];
  const pictures = [];

  files.forEach((file) => {
    const ext = file.filename
      .slice(file.filename.lastIndexOf("."))
      .toLowerCase();
    if (videoExtensions.includes(ext)) {
      videos.push(file);
    } else if (pictureExtensions.includes(ext)) {
      pictures.push(file);
    }
  });

  return { videos, pictures };
}

const addMessageFiles = async (data) => {
  const { replied, userId, message, sentTo, files } = data;

  const { videos: video, pictures: photo } = await separateFiles(files);

  // count percentage
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
      "addMessage"
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
      "addMessage"
    );
  }

  const dataSaved = new Message({
    message: message || null,
    replied: replied || null,
    file: [...videoSchemaIds, ...photoSchemaIds],
    sent_to: sentTo,
    sent_by: userId,
  });

  await dataSaved.save();

  // socket.to(userId).emit("postUploaded", 100);
  parentPort.postMessage({ userId: sentTo, percentage: 100, status: "addMessage" });

  return true;
};

module.exports = addMessageFiles;
