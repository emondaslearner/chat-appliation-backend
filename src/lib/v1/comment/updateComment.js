const Comment = require("@models/Comment");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const updateComment = async ({ body, userId, id }) => {
  if (!body || !userId) {
    throw error.badRequest(
      `${!body && "body:body is missing"}|${
        !userId && "userId:userId is missing"
      }`
    );
  }

  const comment = await Comment.findOne({
    _id: id,
    send_by: userId,
  });

  if (!comment) {
    throw error.notFound();
  }

  comment.body = body;

  await comment.save();

  deleteKeysWithPrefix("comments:");

  return comment;
};

module.exports = updateComment;
