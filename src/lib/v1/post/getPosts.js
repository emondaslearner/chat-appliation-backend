const { error, functions } = require("@utils");
const Posts = require("@models/Post");
const Friend = require("@models/Friend");
const lodash = require("lodash");

const getPosts = async ({ userId, filterData }) => {
  if (!userId) {
    throw error.badRequest("userId:userId is missing");
  }

  const friendFilter = {
    $and: [
      { $or: [{ first_user: userId }, { second_user: userId }] },
      { blocked: false },
    ],
  };

  const friends = await Friend.find(friendFilter);

  const friendsIds = friends.map((friend) => {
    return friend.second_user.toString() === userId
      ? friend.first_user
      : friend.second_user;
  });

  // const allFriendsStringify = await getDataFromRedis(
  //   `userFriends:${userId}`,
  //   () => friendsIds,
  //   86400
  // );

  // const allFriends = allFriendsStringify

  const sortStr = `${filterData.sortType === "dsc" ? "-" : ""}${
    filterData.sortBy
  }`;

  const posts = await Posts.find({ user: { $in: friendsIds } })
    .populate({
      path: "photos",
      select: "photo",
    })
    .populate({
      path: "videos",
      select: "video",
    })
    .populate({
      path: "reactions",
      select: "reaction given_by",
    })
    .populate({
      path: "user",
      select: "name profile_picture",
    })
    .sort(sortStr)
    .skip(filterData.page * filterData.limit - filterData.limit)
    .limit(filterData.limit)
    .exec();

  const shufflePosts = lodash.shuffle(posts);

  const counts = await functions.countEntities(Posts, {
    user: { $in: friendsIds },
  });

  return { posts: shufflePosts, counts };
};

module.exports = getPosts;
