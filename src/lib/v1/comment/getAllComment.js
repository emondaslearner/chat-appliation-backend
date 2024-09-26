const Comment = require("@models/Comment");
const { getDataFromRedis } = require("@third-party/redis");
const { error, functions } = require("@utils");

const getAllComment = async ({ post, filterData }) => {
  if (!post || !filterData) {
    throw error.badRequest(`${!post && "post:post is missing"}`);
  }

  const sortStr = `${filterData.sortType === "dsc" ? "-" : ""}${
    filterData.sortBy
  }`;
  const filter = {
    post,
  };

  const getComments = async () => {
    return await Comment.find(filter)
      .populate("send_by", "name profile_picture")
      .populate({
        path: "reactions",
        select: "reaction given_by",
      })
      .sort(sortStr)
      .skip(filterData.page * filterData.limit - filterData.limit)
      .limit(filterData.limit);
  };

  // check in redis
  const serializedFilterData = JSON.stringify(filterData);
  const keyPrefix = "comments:";
  const key = `${keyPrefix}${serializedFilterData}${post}`;

  const result = await getDataFromRedis(key, getComments);

  const counts = await functions.countEntities(Comment, filter);

  return { comments: result, counts };
};

module.exports = getAllComment;
