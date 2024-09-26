const Comment = require("@models/Comment");
const Post = require("@models/Post");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const deleteComment = async ({ id, userId }) => {
  if (!id || !userId) {
    throw error.badRequest(
      `${!id && "id:id is missing"}|${!userId && "userId:userId is missing"}`
    );
  }

  const comment = await Comment.findOne({
    _id: id,
    send_by: userId,
  });

  if (!comment) {
    throw error.notFound();
  }

  // get posts
  const posts = await Post.findOne({
    _id: comment.post,
  });

  const commentCount = posts.commentCount - 1;
  
  posts.commentCount = commentCount;

  await posts.save();

  deleteKeysWithPrefix("comments:");

  return true;
};

module.exports = deleteComment;
