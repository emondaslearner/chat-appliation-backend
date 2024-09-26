const { error } = require("@utils");
const Photo = require("@models/Photo");
const { getDataFromRedis } = require("@third-party/redis");
const { functions } = require("@utils");

const getAllPhoto = async ({
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

  const getPhotos = async () => {
    return await Photo.find(filter)
      .populate("user", "name profile_picture")
      .sort(sortStr)
      .skip(filterData.page * filterData.limit - filterData.limit)
      .limit(filterData.limit);
  };

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "photos:";
  const key = `${keyPrefix}${serializedFilterData}${userId}`;

  const result = await getDataFromRedis(key, getPhotos);

  const counts = await functions.countEntities(Photo, filter);

  return { photos: result, counts };
};

module.exports = getAllPhoto;
