const { Schema, model } = require("mongoose");

const photoSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    photo: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    id: true,
  }
);

photoSchema.index({ user: 1 });

const photoModel = model("photo", photoSchema);

module.exports = photoModel;
