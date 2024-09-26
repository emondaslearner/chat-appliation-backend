const { acceptRequest: acceptRequestLib } = require("@lib/v1/friendRequest");

const acceptRequest = async (req, res, next) => {
  try {
    const data = await acceptRequestLib({
      userId: req.user.id,
      friendId: req.body?.friendId,
    });

    const response = {
      code: 201,
      message: "Friend request accepted successfully",
      data,
      self: req.url,
      links: {
        friend: "/user/friend",
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = acceptRequest;
