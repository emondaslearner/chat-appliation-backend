const { Schema, model } = require("mongoose");

const reactionSchema = new Schema(
  {
    reaction: {
      type: String,
      enum: ["like", "love", "care", "haha", "angry", "sad", "wow"],
    },
    post: {
      type: Schema.ObjectId,
      ref: "post"
    },
    comment: {
      type: Schema.ObjectId,
      ref: "comment"
    },
    given_by: {
      type: Schema.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

const reactionModel = model("reaction", reactionSchema);

module.exports = reactionModel;
