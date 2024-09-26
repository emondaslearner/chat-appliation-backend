const { addFriend: addFriendLib } = require("@lib/v1/friends");

const addFriend = async (req, res, next) => {
  try {
    await addFriendLib({ friendId: req.body?.friendId, userId: req.user.id });

    const response = {
      code: 201,
      message: "FriendRequest sent successfully",
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = addFriend;
