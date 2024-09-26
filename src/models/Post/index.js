const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    reactions: [
      {
        type: Schema.ObjectId,
        ref: "reaction",
      },
    ],
    title: {
      type: String
    },
    color: {
      type: String,
    },
    videos: [
      {
        type: Schema.ObjectId,
        ref: "video",
      },
    ],
    photos: [
      {
        type: Schema.ObjectId,
        ref: "photo",
      },
    ],
    reactionCount: {
      type: Number,
      default: 0,
    },
    loveCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    careCount: {
      type: Number,
      default: 0
    },
    hahaCount: {
      type: Number,
      default: 0
    },
    angryCount: {
      type: Number,
      default: 0
    },
    sadCount: {
      type: Number,
      default: 0
    },
    wowCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

postSchema.index({ title: 1, user: 1 });

const postModel = model("post", postSchema);

module.exports = postModel;
