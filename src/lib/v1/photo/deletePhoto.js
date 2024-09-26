const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");
const Photo = require("@models/Photo");

const deletePhoto = async ({ userId, photoId }) => {
  if (!photoId) {
    throw error.badRequest("photoId: photoId is missing");
  }

  const findPhoto = await Photo.findOne({ user: userId, _id: photoId });

  if (!findPhoto) {
    throw error.notFound();
  }

  const deleteP = await Photo.findOneAndDelete({
    user: userId,
    _id: photoId,
  });

  deleteKeysWithPrefix("photos:");

  return deleteP;
};

module.exports = deletePhoto;
