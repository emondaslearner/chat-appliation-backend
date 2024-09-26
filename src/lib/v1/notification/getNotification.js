const Notification = require("@models/Notification");
const { getDataFromRedis } = require("@third-party/redis");
const { functions } = require("@utils");

const getNotification = async ({ userId, filterData }) => {
  if (!userId) {
    throw error.badRequest("userId:userId not provided");
  }

  const sortStr = `${filterData.sortType === "dsc" ? "-" : ""}${
    filterData.sortBy
  }`;
  const filter = {
    title: { $regex: filterData.search, $options: "i" },
    user: userId,
  };

  const getNotifications = async () => {
    return await Notification.find(filter)
      .sort(sortStr)
      .skip(filterData.page * filterData.limit - filterData.limit)
      .limit(filterData.limit);
  };

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "notifications:";
  const key = `${keyPrefix}${serializedFilterData}${userId}`;

  const notifications = await getDataFromRedis(key, getNotifications);

  const counts = await functions.countEntities(Notification, filter);

  return { notifications, counts };
};

module.exports = getNotification;
