const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadPhotoToCloudinary = async ({
  imagePath,
  folderName,
  unique_filename,
  use_filename,
  overwrite,
}) => {
  try {
    const options = {
      folder: folderName,
      unique_filename,
      use_filename,
      overwrite,
    };

    const uploadResponse = await cloudinary.v2.uploader.upload(
      imagePath,
      options
    );
    return uploadResponse;
  } catch (error) {
    throw error;
  }
};

const uploadVideoToCloudinary = async ({ videoPath, folderName }) => {
  try {
    const data = await cloudinary.v2.uploader.upload(videoPath, {
      folder: folderName,
      resource_type: "video",
      eager: [
        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        {
          width: 160,
          height: 100,
          crop: "crop",
          gravity: "south",
          audio_codec: "none",
        },
      ],
    });
    return data.secure_url || data.url;
  } catch (error) {
    throw error;
  }
};

module.exports = { uploadPhotoToCloudinary, uploadVideoToCloudinary };
