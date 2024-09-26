const { error } = require("@utils");
const Video = require("@models/Video");
const { getDataFromRedis } = require("@third-party/redis");
const { functions } = require("@utils");

const getAllVideo = async ({
  userId,
  filterData = {
    search: "",
    sortBy: "updatedAt",
    sortType: "dsc",
    page: 1,
    limit: 10,
  },
}) => {
  if (!userId) {
    throw error.badRequest("userId:userId is missing");
  }

  const sortStr = `${filterData.sortType === "dsc" ? "-" : ""}${
    filterData.sortBy
  }`;

  const filter = {
    user: userId,
  };

  const getVideos = async () => {
    return await Video.find(filter)
      .populate("user", "name profile_picture")
      .sort(sortStr)
      .skip(filterData.page * filterData.limit - filterData.limit)
      .limit(filterData.limit);
  };

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "videos:";
  const key = `${keyPrefix}${serializedFilterData}${userId}`;

  const result = await getDataFromRedis(key, getVideos);

  const counts = await functions.countEntities(Video, filter);

  return { videos: result, counts };
};

module.exports = getAllVideo;
