const { saveToken, getNotification } = require("@controller/v1/notification");

const notificationRoutes = async (router, authenticate) => {
  router.post("/user/notification", authenticate, saveToken);
  router.get("/user/notifications", authenticate, getNotification);
};

module.exports = notificationRoutes;
