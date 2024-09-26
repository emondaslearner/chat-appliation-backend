const { Schema, model } = require("mongoose");

const friendSchema = new Schema(
  {
    sent_by: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    sent_to: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

friendSchema.index({ sent_by: 1, sent_to: 1 });

const friendModel = model("friend-request", friendSchema);

module.exports = friendModel;
