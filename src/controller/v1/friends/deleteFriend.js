const { deleteFriend: deleteFriendLib } = require("@lib/v1/friends");
const { error } = require("@utils");

const deleteFriend = async (req, res, next) => {
  try {
    const isDeleted = await deleteFriendLib({
      friendId: req.params?.id,
      userId: req.user.id,
    });

    if (isDeleted) {
      res.status(204).end();
      return;
    }

    throw error.notFound();
  } catch (err) {
    next(err);
  }
};

module.exports = deleteFriend;
