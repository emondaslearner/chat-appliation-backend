const { saveToken: saveTokenLib } = require("@lib/v1/notification");

const saveToken = async (req, res, next) => {
  try {
    await saveTokenLib({
      token: req.body?.token,
      userId: req.user.id,
    });

    const response = {
      code: 201,
      message: "Saved token successfully",
      self: req.url,
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = saveToken;
