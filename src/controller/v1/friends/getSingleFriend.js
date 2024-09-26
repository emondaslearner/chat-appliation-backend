const { getSingleFriend: getSingleFriendLib } = require("@lib/v1/friends");

const getSingleFriend = async (req, res, next) => {
  try {
    const friend = await getSingleFriendLib({
      userId: req.user.id,
      friendId: req.params?.id,
    });

    const responseData = {
      code: 200,
      message: "Got single friend",
      data: friend,
      self: req.url,
      links: {
        friend: "/user/friend",
      },
    };

    res.status(responseData.code).json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = getSingleFriend;
