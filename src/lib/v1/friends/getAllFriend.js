const Friend = require("@models/Friend");
const { error } = require("@utils");
const mongoose = require("mongoose");
const { getDataFromRedis } = require("@third-party/redis");

const getAllFriend = async ({
  userId,
  filterData = {
    search: "",
    sortBy: "updatedAt",
    sortType: "dsc",
    page: 1,
    limit: 10,
  },
}) => {
  const sortField = filterData.sortBy;
  const sortDirection = filterData.sortType === "dsc" ? -1 : 1;
  const sortStr = { [sortField]: sortDirection };

  if (!userId) {
    throw error.badRequest("userId:userId not provided");
  }

  const pipeline = [
    {
      $match: {
        $or: [
          { first_user: new mongoose.Types.ObjectId(userId) },
          { second_user: new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "first_user",
        foreignField: "_id",
        as: "first_user_details",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "second_user",
        foreignField: "_id",
        as: "second_user_details",
      },
    },
    {
      $unwind: "$first_user_details",
    },
    {
      $unwind: "$second_user_details",
    },
    {
      $match: {
        $or: [
          {
            "second_user_details.name": {
              $regex: filterData.search,
              $options: "i",
            },
            first_user: new mongoose.Types.ObjectId(userId),
          },
          {
            "first_user_details.name": {
              $regex: filterData.search,
              $options: "i",
            },
            second_user: new mongoose.Types.ObjectId(userId),
          },
        ],
      },
    },
    {
      $facet: {
        totalCount: [{ $count: "count" }],
        allFriends: [
          { $sort: sortStr },
          { $skip: (filterData.page - 1) * filterData.limit },
          { $limit: filterData.limit },
          {
            $project: {
              first_user: {
                _id: "$first_user_details._id",
                name: "$first_user_details.name",
                profile_picture: "$first_user_details.profile_picture",
                bio: "$first_user_details.bio",
                address: "$first_user_details.address",
                date_of_birth: "$first_user_details.date_of_birth",
                status: "$first_user_details.status",
                updatedAt: "$first_user.updatedAt",
              },
              second_user: {
                _id: "$second_user_details._id",
                name: "$second_user_details.name",
                profile_picture: "$second_user_details.profile_picture",
                bio: "$second_user_details.bio",
                address: "$second_user_details.address",
                date_of_birth: "$second_user_details.date_of_birth",
                status: "$second_user_details.status",
                updatedAt: "$first_user.updatedAt",
              },
              blocked: 1,
              blocked_by: 1,
            },
          },
        ],
      },
    },
  ];

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "friend:";
  const key = `${keyPrefix}${serializedFilterData}${userId}`;

  const result = await getDataFromRedis(
    key,
    async () => await Friend.aggregate(pipeline)
  );

  const totalCount =
    result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
  const allFriends = result[0].allFriends;

  return { count: totalCount, allFriends };
};

module.exports = getAllFriend;
