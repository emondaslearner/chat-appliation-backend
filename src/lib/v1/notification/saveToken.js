const { error } = require("@utils");
const { subscribeToTopic } = require("@third-party/firebase");
const FirebaseToken = require("@models/FirebaseToken");

const saveToken = async ({ token, userId }) => {
  if (!token || !userId) {
    throw error.badRequest(
      `${!token && "token:token not provided"}|${
        !userId && "userId:userId not provided"
      }`
    );
  }

  const isSubscribed = await subscribeToTopic({
    token: token,
    topicName: userId,
  });

  if (!isSubscribed) {
    throw error.serverError();
  }

  const data = await FirebaseToken({
    token,
    user_id: userId,
  });

  await data.save();

  return DataView;
};

module.exports = saveToken;
