const {
  addFriend,
  deleteFriend,
  blockFriend,
  getSingleFriend,
  getAllFriend,
} = require("@controller/v1/friends");

const friendRoutes = (router, authenticate) => {
  router
    .route("/user/friends")
    .post(authenticate, addFriend)
    .patch(authenticate, blockFriend)
    .get(authenticate, getAllFriend);

  router.delete("/user/:id/friend", authenticate, deleteFriend);
  router.get("/user/:id/friend", authenticate, getSingleFriend);
};

module.exports = friendRoutes;
