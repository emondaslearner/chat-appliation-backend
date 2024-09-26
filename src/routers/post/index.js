const {
  addPost,
  deletePost,
  updatePost,
  getMyPosts,
  getPosts,
} = require("@controller/v1/post");
const { addOrCancelReaction } = require("@controller/v1/reaction");
const multer = require("multer");
const path = require("path");

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

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const error = new Error("Image not support at this version");
    error.status = 400;
    return cb(error, false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const uploadFields = upload.fields([
  { name: "photo", maxCount: 10 },
  { name: "video", maxCount: 5 },
]);

const postRoutes = async (router, authenticate) => {
  router
    .route("/user/posts")
    .post([authenticate, uploadFields], addPost)
    .get(authenticate, getMyPosts);

  router.get("/user/feeds", authenticate, getPosts);

  router
    .route("/user/post/:id")
    .delete(authenticate, deletePost)
    .patch([authenticate, uploadFields], updatePost);

  router.post("/user/post/:id/reaction", authenticate, addOrCancelReaction);
};

module.exports = postRoutes;
