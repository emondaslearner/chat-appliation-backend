const { getAllPhoto, deletePhoto } = require("@controller/v1/photo");

const photoRoutes = async (router, authenticate) => {
  router.get("/user/photos", authenticate, getAllPhoto);
  router.delete("/user/photo/:id", authenticate, deletePhoto);
};

module.exports = photoRoutes;
