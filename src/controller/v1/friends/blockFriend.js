const { blockFriend: blockFriendLib } = require("@lib/v1/friends");

const blockFriend = async (req, res, next) => {
  try {
    const blockedFriend = await blockFriendLib({
      friendId: req.body?.friendId,
      userId: req.user.id,
      block: req.body?.block,
    });

    const responseData = {
      code: 200,
      message: `User ${req.body.block ? "blocked" : "unblocked"} successfully`,
      data: blockedFriend,
      self: req.url,
      links: {
        friend: "/user/friends",
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = blockFriend;
