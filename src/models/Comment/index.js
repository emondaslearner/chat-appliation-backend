const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    send_by: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    post: {
      type: Schema.ObjectId,
      ref: "post",
      required: true,
    },
    path: {
      type: String,
    },
    parent: {
      type: String,
    },
    replyCount: {
      type: Number,
      default: 0,
    },
    reactionCount: {
      type: Number,
      default: 0,
    },
    reactions: [
      {
        type: Schema.ObjectId,
        ref: "reaction",
      },
    ],
  },
  {
    timestamps: true,
    id: true,
  }
);

const commentModel = model("comment", commentSchema);

module.exports = commentModel;
