const Message = require("@models/Message");
const { error, functions } = require("@utils");
const { getDataFromRedis } = require("@third-party/redis");

const getChatMessages = async ({ userId, chatId, filterData }) => {
  if (!userId && !chatId) {
    throw error.badRequest(
      `${!userId && "userId:userId is missing"}|${
        !chatId && "chatId:chatId is missing"
      }`
    );
  }

  const sortStr = `${filterData.sortType === "dsc" ? "-" : ""}${
    filterData.sortBy
  }`;

  const filter = {
    $and: [
      {
        $or: [{ sent_by: userId }, { sent_to: userId }],
      },
      {
        $or: [{ sent_by: chatId }, { sent_to: chatId }],
      },
    ],
  };

  const getComments = async () => {
    return await Message.find(filter)
      .populate("sent_by", "name profile_picture")
      .populate("sent_to", "name profile_picture")
      .sort(sortStr)
      .skip(filterData.page * filterData.limit - filterData.limit)
      .limit(filterData.limit);
  };

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "messages:";
  const key = `${keyPrefix}${serializedFilterData}${userId}`;

  const result = await getDataFromRedis(key, getComments);

  const counts = await functions.countEntities(Message, filter);

  return { messages: result, counts };
};

module.exports = getChatMessages;
