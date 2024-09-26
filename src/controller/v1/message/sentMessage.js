const { sentMessage: sentMessageLib } = require("@lib/v1/message");

const sentMessage = async (req, res, next) => {
  try {
    const allFiles = req.files?.files;

    console.log(req.body);

    const { messageData, user } = await sentMessageLib({
      sentTo: req.params?.id,
      userId: req.user.id,
      message: req.body?.message,
      files: allFiles ? allFiles : [],
      replied: req.body?.replied,
    });

    let response = {};
    if (messageData) {
      response = {  
        code: 201,
        message: "Message sended successfully",
        data: messageData,
        user: user,
        self: req.url,
      };
    } else {
      response = {
        code: 200,
        message:
          "Message will soon upload and we will update you the progress via a socket connection called 'addMessage'",
        self: req.url,
      };
    }

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = sentMessage;
