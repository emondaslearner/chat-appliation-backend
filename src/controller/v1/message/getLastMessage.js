const { getLastMessage: getLastMessageLib } = require("@lib/v1/message");

const getLastMessage = async (req, res, next) => {
  try {
    const data = await getLastMessageLib({
        userId: req.user.id,
        id: req.params.id
    });

    const response = {
        code: 200,
        message: "Data fetched successfully",
        data,
        self: req.url
    }

    res.status(200).json(response)
  } catch (err) {
    next(err);
  }
};

module.exports = getLastMessage;
