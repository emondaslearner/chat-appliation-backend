const User = require("@models/User");
const Friend = require("@models/Friend");
const { error, functions } = require("@utils");
const { getDataFromRedis } = require("@third-party/redis");
const FriendRequest = require("@models/FriendRequest");

const getAllUser = async ({ filterData, userId, type }) => {
  if (!userId) {
    throw error.badRequest("userId:userId is missing");
  }

  const sortStr = `${filterData.sortType === "dsc" ? "-" : ""}${
    filterData.sortBy
  }`;

  const filter = { _id: { $ne: userId } };

  if (filterData.search) {
    filter.name = filterData.search;
  }

  // Step 1: Retrieve users based on filter, sort, and pagination criteria
  const users = await User.find(filter)
    .select("name profile_picture status updatedAt")
    .sort(sortStr)
    .skip(filterData.page * filterData.limit - filterData.limit)
    .limit(filterData.limit)
    .lean();

  // Step 2: Retrieve all friend relationships for the current user
  const friends = await Friend.find({
    $or: [{ first_user: userId }, { second_user: userId }],
  });

  const friendsRequest = await FriendRequest.find({
    $or: [{ sent_by: userId }, { sent_to: userId }],
  });

  // Step 3: Add the 'friend' property to each user
  const getUsers = (async = () => {
    const usersWithFriendStatus = users.map((user) => {
      const isFriend = friends.some(
        (friend) =>
          (friend.first_user.toString() === user._id.toString() ||
            friend.second_user.toString() === user._id.toString()) &&
          !friend.blocked
      );
      return {
        ...user,
        friend: isFriend,
      };
    });

    let filteredUsers;

    switch (type) {
      case "friend":
        filteredUsers = usersWithFriendStatus.filter((user) => user.friend);
        break;
      case "no-friend":

        filteredUsers = usersWithFriendStatus.filter((user) => {
          if (user.friend) {
            return false;
          }

          const hasPendingRequest = friendsRequest.some((request) => {
            const requestUser =
              request.sent_by.toString() === userId
                ? request.sent_to.toString()
                : request.sent_by.toString();
            return requestUser === user._id.toString();
          });

          return !hasPendingRequest;
        });
        break;
      case "all":
      default:
        filteredUsers = usersWithFriendStatus;
        break;
    }


    return filteredUsers;
  });

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "users:";
  const key = `${keyPrefix}${serializedFilterData}${userId}${type}`;

  const usersData = await getDataFromRedis(key, getUsers);

  const counts = await functions.countEntities(User, filter);

  return { users: usersData, counts };
};

module.exports = getAllUser;
