const Friend = require("@models/Friend");
const { error } = require("@utils");
const { getDataFromRedis } = require("@third-party/redis");
const mongoose = require("mongoose");

const getAllChats = async ({ filterData, userId }) => {
  if (!userId) {
    throw error.badRequest("userId:userId is missing");
  }

  const sortField = filterData.sortBy;
  const sortDirection = filterData.sortType === "dsc" ? -1 : 1;
  const sortStr = { [sortField]: sortDirection };

  const filter = {
  $and: [
    {
      $or: [
        { first_user: new mongoose.Types.ObjectId(userId) },
        { second_user: new mongoose.Types.ObjectId(userId) },
      ],
    },
    { chat_deleted_for: { $nin: [userId] } },
  ],
};

  if (filterData.filter === "unread") {
    filter.$and.push({ unread_message_count: { $ne: 0 } });
  }

  const aggregationPipeline = [
    {
      $match: filter, // This filters out chats deleted for the user
    },
    {
      $lookup: {
        from: "users",
        localField: "first_user",
        foreignField: "_id",
        as: "first_user",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "second_user",
        foreignField: "_id",
        as: "second_user",
      },
    },
    {
      $unwind: "$first_user",
    },
    {
      $unwind: "$second_user",
    },
    {
      $match: {
        $or: [
          {
            "second_user.name": {
              $regex: filterData.search,
              $options: "i",
            },
          },
          {
            "first_user.name": {
              $regex: filterData.search,
              $options: "i",
            },
          },
        ],
      },
    },
    {
      $facet: {
        count: [{ $count: "count" }],
        chats: [
          { $sort: sortStr },
          { $skip: (filterData.page - 1) * filterData.limit },
          { $limit: filterData.limit },
          {
            $project: {
              first_user: {
                _id: "$first_user._id",
                name: "$first_user.name",
                profile_picture: "$first_user.profile_picture",
                status: "$first_user.status",
                bio: "$first_user.bio",
                updatedAt: "$first_user.updatedAt",
              },
              second_user: {
                _id: "$second_user._id",
                name: "$second_user.name",
                profile_picture: "$second_user.profile_picture",
                status: "$second_user.status",
                bio: "$second_user.bio",
                updatedAt: "$second_user.updatedAt",
              },
              unread_message_count: 1,
              chat_deleted_for: 1,
              last_message: 1,
              updatedAt: 1,
              blocked: 1,
              blocked_by: 1
            },
          },
        ],
      },
    },
  ];

  const getChants = async () => {
    const friendData = await Friend.aggregate(aggregationPipeline);

    const { chats, count } = friendData[0];

    // Conditionally populate the fields
    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        if (chat.first_user.toString() === userId.toString()) {
          return await Friend.populate(chat, {
            path: "second_user",
            select:
              "name profile_picture updatedAt bio unread_message_count status",
          });
        } else {
          return await Friend.populate(chat, {
            path: "first_user",
            select:
              "name profile_picture updatedAt bio unread_message_count status",
          });
        }
      })
    );

    return { populatedChats, count };
  };

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "chats:";
  const key = `${keyPrefix}${serializedFilterData}${userId}`;

  const { populatedChats, count } = await getDataFromRedis(key, getChants);

  return { chats: populatedChats, counts: count };
};

module.exports = getAllChats;
