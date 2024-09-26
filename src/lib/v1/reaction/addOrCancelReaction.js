const Reaction = require("@models/Reaction");
const Post = require("@models/Post");
const Comment = require("@models/Comment");
const { error } = require("@utils");
const { deleteKeysWithPrefix } = require("@third-party/redis");
const { sentMessageToTopic } = require("@third-party/firebase");

const addOrCancelReaction = async ({ userId, postId, reaction, commentId }) => {
  if (!userId || !reaction) {
    throw error.badRequest(
      `${!userId && "userId:userId is missing"}|${
        !reaction && "reaction:reaction is missing"
      }`
    );
  }

  if (!postId && !commentId) {
    throw error.badRequest("id: postId and commentId both missing");
  }

  const reactionTypes = ["like", "love", "care", "haha", "angry", "sad", "wow"];

  if (!reactionTypes.includes(reaction)) {
    throw error.badRequest("reaction:reaction is not valid");
  }

  let post = null;
  if (postId) {
    post = await Post.findOne({ _id: postId });

    if (!post) {
      throw error.notFound("Post not found");
    }
  }

  let comment = null;
  if (commentId) {
    comment = await Comment.findOne({ _id: commentId });

    if (!comment) {
      throw error.notFound("Comment not found");
    }
  }

  let reactionOb = null;
  if (postId) {
    reactionOb = await Reaction.findOne({
      post: postId,
      given_by: userId,
    });
  }

  if (commentId) {
    reactionOb = await Reaction.findOne({
      comment: commentId,
      given_by: userId,
    });
  }

  // reaction count
  let reactionCount = post ? post.reactionCount : comment.reactionCount;
  let reactionTypeCount = post
    ? post[`${reaction}Count`]
    : comment[`${reaction}Count`];
  let reactionTypeOldCount = reactionOb?.reaction
    ? post
      ? post[`${reactionOb.reaction}Count`]
      : comment[`${reactionOb.reaction}Count`]
    : 0;

  deleteKeysWithPrefix("posts:");

  if (reactionOb?.reaction === reaction && reactionOb) {
    const list = postId ? [...post.reactions] : [...comment.reactions];

    const index = list.indexOf(reactionOb._id);

    reactionCount--;
    reactionTypeCount--;

    list.splice(index, 1);

    if (post) {
      post.reactions = list;
      post.reactionCount = reactionCount;
      post[`${reaction}Count`] = reactionTypeCount;

      await post.save();

      await Reaction.deleteOne({
        post: postId,
        given_by: userId,
      });
    }

    if (comment) {
      comment.reactions = list;
      comment.reactionCount = reactionCount;
      comment[`${reaction}Count`] = reactionTypeCount;

      await comment.save();

      await Reaction.deleteOne({
        comment: commentId,
        given_by: userId,
      });
    }

    return "deleted";
  } else if (reactionOb?.reaction !== reaction && reactionOb) {
    reactionTypeCount++;
    reactionTypeOldCount--;

    const oldReaction = `${reactionOb.reaction}Count`;
    const newReaction = `${reaction}Count`;

    reactionOb.reaction = reaction;

    if (post) {
      post[newReaction] = reactionTypeCount;
      post[oldReaction] = reactionTypeOldCount;

      await post.save();
    }

    if (comment) {
      comment[newReaction] = reactionTypeCount;
      comment[oldReaction] = reactionTypeOldCount;

      await comment.save();
    }

    await reactionOb.save();

    // sent update via socket
    io.to(userId).emit(`reaction$`, {
      userId,
      postId,
      reaction,
    });

    return "updated";
  }

  if (post) {
    sentMessageToTopic({
      topic: post.user,
      title: `A friend reacted to your post`,
      body: `A friend reacted to your post. post title is ${post.title}`,
    });
  }

  reactionCount++;
  reactionTypeCount++;

  if (post) {
    const reactionData = await Reaction({
      reaction,
      post: postId,
      given_by: userId,
    });

    await reactionData.save();

    post.reactions = [...post.reactions, reactionData._id];
    post.reactionCount = reactionCount;
    post[`${reaction}Count`] = reactionTypeCount;

    await post.save();
  }

  if (comment) {
    const reactionData = await Reaction({
      reaction,
      comment: commentId,
      given_by: userId,
    });

    await reactionData.save();

    comment.reactions = [...comment.reactions, reactionData._id];
    comment.reactionCount = reactionCount;
    comment[`${reaction}Count`] = reactionTypeCount;

    await comment.save();
  }

  // sent update via socket
  io.to(userId).emit(`reaction$`, {
    userId,
    postId,
    reaction,
  });

  return "added";
};

module.exports = addOrCancelReaction;
