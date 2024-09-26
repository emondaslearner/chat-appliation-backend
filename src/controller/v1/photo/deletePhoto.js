const { deletePhoto: deletePhotoLib } = require("@lib/v1/photo");

const deletePhoto = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isDeleted = await deletePhotoLib({
      photoId: req.params?.id,
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

module.exports = deletePhoto;
