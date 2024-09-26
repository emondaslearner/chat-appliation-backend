const { getUser: getUserLib } = require("@lib/v1/user");

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userData = await getUserLib({ userId, id: req.query?.userId });

    const responseData = {
      code: 200,
      message: "User data fetched successfully",
      data: userData,
      self: req.url,
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = getUser;
