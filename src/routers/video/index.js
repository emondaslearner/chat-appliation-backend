const { getAllVideo, deleteVideo } = require("@controller/v1/video");

const videoRoutes = (router, authenticate) => {
  router.get("/user/videos", authenticate, getAllVideo);
  router.delete("/user/video/:id", authenticate, deleteVideo);
};

module.exports = videoRoutes;
