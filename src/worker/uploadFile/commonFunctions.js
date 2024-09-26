const {
  uploadPhotoToCloudinary,
  uploadVideoToCloudinary,
} = require("../../third-party/cloudinary");
const Video = require("../../models/Video");
const Photo = require("../../models/Photo");
const { parentPort } = require("worker_threads");

const uploadPostVideo = async (
  video,
  userId,
  perVideoPercentage,
  percentage,
  status
) => {
  const videoSchemaIds = [];
  const video_list = [];

  for (let i = 0; i < video.length; i++) {
    const url = await uploadVideoToCloudinary({
      videoPath: `./src/uploads/${video[i].filename}`,
      folderName: "post-videos",
    });

    video_list.push({
      video: url,
      user: userId,
    });

    // update the upload status via socket connection
    // socket.to(userId).emit("postUploaded", percentage * (i + 1));
    parentPort.postMessage({
      userId,
      percentage: percentage + perVideoPercentage * (i + 1),
      status,
    });
  }

  if (status !== "addMessage") {
    const video_data = await Video.insertMany(video_list);
    video_data.map((data) => videoSchemaIds.push(data._id));
  } else {
    video_list.map((data) => videoSchemaIds.push(data.video));
  }

  return videoSchemaIds;
};

const uploadPostPhoto = async (photo, userId, percentage, status) => {
  const photoSchemaIds = [];
  const url_list = [];

  for (let i = 0; i < photo.length; i++) {
    const fileUploadedData = await uploadPhotoToCloudinary({
      imagePath: `./src/uploads/${photo[i].filename}`,
      folderName: "post-photos",
      unique_filename: true,
      use_filename: false,
      overwrite: false,
    });

    url_list.push({
      user: userId,
      photo: fileUploadedData.secure_url,
    });

    // update the upload status via socket connection
    // socket.to(userId).emit("postUploaded", percentage * (i + 1));
    parentPort.postMessage({
      userId,
      percentage: percentage * (i + 1),
      status,
    });
  }

  if (status !== "addMessage") {
    const photo_data = await Photo.insertMany(url_list);
    photo_data.map((data) => photoSchemaIds.push(data._id));
  } else {
    url_list.map((data) => photoSchemaIds.push(data.photo));
  }

  return photoSchemaIds;
};

const calculatePercentagePerFile = async (photoLength, videoLength) => {
  // calculate percentage
  const totalFiles = photoLength + videoLength;

  const totalPercentage = 90;

  // Calculate the percentage allocation based on the number of photos and videos
  const photoAllocation = (photoLength / totalFiles) * totalPercentage;
  const videoAllocation = (videoLength / totalFiles) * totalPercentage;

  // Calculate the per-item percentage
  const perPhotoPercentage =
    photoLength > 0 ? Math.ceil(photoAllocation / photoLength) : 0;
  const perVideoPercentage =
    videoLength > 0 ? Math.ceil(videoAllocation / videoLength) : 0;

  return {
    photoPercentage: perPhotoPercentage,
    videoPercentage: perVideoPercentage,
  };
};

module.exports = {
  uploadPostVideo,
  uploadPostPhoto,
  calculatePercentagePerFile,
};
