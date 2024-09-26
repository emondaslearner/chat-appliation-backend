const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

videoSchema.index({ user: 1 });

const videoModel = model("video", videoSchema);

module.exports = videoModel;
