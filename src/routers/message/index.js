const {
  sentMessage,
  deleteMessage,
  editMessage,
  getChatMessages,
  getAllMessage,
  seenMessage,
  getLastMessage,
} = require("@controller/v1/message");
const multer = require("multer");

// multer upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads/");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    cb(null, originalName);
  },
});

const upload = multer({ storage: storage });

const uploadFields = upload.fields([{ name: "files", maxCount: 10 }]);

const messageRoutes = (router, authenticate) => {
  router
    .route("/user/:id/message")
    .post([authenticate, uploadFields], sentMessage)
    .get(authenticate, getChatMessages)
    .patch(authenticate, seenMessage);

  router
    .route("/user/message/:id")
    .patch(authenticate, editMessage)
    .delete(authenticate, deleteMessage);

  router.get("/user/:id/last-message", authenticate, getLastMessage);

  router.get("/user/messages", authenticate, getAllMessage);
};

module.exports = messageRoutes;
