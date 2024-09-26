const {
  addComment,
  deleteComment,
  updateComment,
  getAllComment,
} = require("@controller/v1/comment");
const { addOrCancelReaction } = require("@controller/v1/reaction");

const commentRoutes = (router, authenticate) => {
  router.post("/user/comments", authenticate, addComment);
  router
    .route("/user/comment/:id")
    .delete(authenticate, deleteComment)
    .patch(authenticate, updateComment);

  router.get("/user/post/:id/comments", authenticate, getAllComment);

  router.post("/user/comment/:id/reaction", authenticate, addOrCancelReaction);
};

module.exports = commentRoutes;
