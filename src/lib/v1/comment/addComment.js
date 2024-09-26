const Comment = require("@models/Comment");
const Post = require("@models/Post");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");
const { sentMessageToTopic } = require("@third-party/firebase");

const addComment = async ({ body, userId, postId, path, parent }) => {
  if (!body || !userId || !postId) {
    throw error.badRequest(
      `${!body && "body:body is missing"}|${
        !userId && "userId:userId not provided"
      }|${postId && "postId:postId is missing"}|${
        !path && "path:path is missing"
      }`
    );
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw error.notFound();
  }

  const commentCount = post.commentCount + 1;
  post.commentCount = commentCount;

  const comment = new Comment({
    message: body,
    post: postId,
    send_by: userId,
    path,
    parent,
  });

  if (parent) {
    const parentComment = await Comment.findById(parent);
    if (!parentComment) {
      throw error.notFound("parent comment not found");
    }
    parentComment.replyCount =
      (parentComment?.replyCount ? parentComment?.replyCount : 0) + 1;
    parentComment.save();
  }

  await comment.save();

  await post.save();

  sentMessageToTopic({
    topic: post.user,
    title: `Got new comment on a post`,
    body: `A friend did a comment to your post. post title is ${post.title}`,
  });

  deleteKeysWithPrefix("comments:");
  deleteKeysWithPrefix("posts:");

  return comment;
};

module.exports = addComment;
