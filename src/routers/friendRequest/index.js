const {
  acceptRequest,
  deleteRequest,
  findAllRequest,
  getSingleRequest,
} = require("@controller/v1/friendRequest");

const friendRequestRoutes = (router, authenticate) => {
  router
    .route("/user/friend-requests")
    .post(authenticate, acceptRequest)
    .get(authenticate, findAllRequest);
  router.route("/user/:id/friend-request").delete(authenticate, deleteRequest).get(authenticate, getSingleRequest);
};

module.exports = friendRequestRoutes;
