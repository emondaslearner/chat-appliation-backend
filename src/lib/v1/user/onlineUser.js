const Friend = require("@models/Friend");
const { functions } = require("@utils");

const getAllOnlineUser = async ({ userId, filterData }) => {
  const filter = {
    $or: [
      {
        first_user: userId,
      },
      {
        second_user: userId,
      },
    ],
  };

  const sortStr = `${filterData.sortType === "dsc" ? "-" : ""}${
    filterData.sortBy
  }`;

  const friends = await Friend.find(filter)
    .populate(
      "first_user",
      "name profile_picture cover_picture bio date_of_birth status createdAt updatedAt"
    )
    .populate(
      "second_user",
      "name profile_picture cover_picture bio date_of_birth status createdAt updatedAt"
    )
    .sort(sortStr)
    .skip(filterData.page * filterData.limit - filterData.limit)
    .limit(filterData.limit);

  // const users = await User.find(filter)
  //   .sort(sortStr)
  //   .skip(filterData.page * filterData.limit - filterData.limit)
  //   .limit(filterData.limit);

  const counts = await functions.countEntities(Friend, filter);

  return { users: friends, counts };
};

module.exports = getAllOnlineUser;
