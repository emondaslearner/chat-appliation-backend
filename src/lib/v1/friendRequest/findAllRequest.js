const FriendRequest = require("@models/FriendRequest");
const { error } = require("@utils");
const mongoose = require("mongoose");
const { getDataFromRedis } = require("@third-party/redis");

const findAllRequest = async ({ userId, filterData }) => {
  if (!userId) {
    throw error.badRequest("userId:userId not provided");
  }

  const sortField = filterData.sortBy;
  const sortDirection = filterData.sortType === "dsc" ? -1 : 1;
  const sortStr = { [sortField]: sortDirection };

  const query = [
    {
      $match: {
        sent_to: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sent_by",
        foreignField: "_id",
        as: "sent_by_details",
      },
    },
    {
      $unwind: "$sent_by_details",
    },
    {
      $match: {
        "sent_by_details.name": {
          $regex: filterData.search,
          $options: "i",
        },
        sent_to: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $facet: {
        totalCount: [{ $count: "count" }],
        allRequests: [
          { $sort: sortStr },
          { $skip: (filterData.page - 1) * filterData.limit },
          { $limit: filterData.limit },
          {
            $project: {
              sent_by: {
                _id: "$sent_by_details._id",
                name: "$sent_by_details.name",
                profile_picture: "$sent_by_details.profile_picture",
              },
              sent_to: 1
            },
          },
        ],
      },
    },
  ];

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "friendRequest:";
  const key = `${keyPrefix}${serializedFilterData}${userId}`;

  const result = await getDataFromRedis(
    key,
    async () => await FriendRequest.aggregate(query)
  );

  const totalCount =
    result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
  const allRequests = result[0].allRequests;

  return { count: totalCount, allRequests };
};

module.exports = findAllRequest;
