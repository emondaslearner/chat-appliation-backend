const { addPost: addPostLib } = require("@lib/v1/post");

const addPost = async (req, res, next) => {
  try {
    const photo = req.files?.photo;
    const video = req.files?.video;

    const payloadData = {
      title: req.body?.title,
      color: req.body?.color,
      photo: photo ? photo : [],
      video: video ? video : [],
      userId: req.user.id,
    };

    const isSuccess = await addPostLib(payloadData);

    let response = {};
    if (isSuccess) {
      response = {
        code: 200,
        message:
          "Post will upload soon. Once it's upload we will let you now via notification.",
        self: req.url,
      };
    } else {
      response = {
        code: 500,
        message: "Something went wrong please try again later",
      };
    }

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = addPost;
