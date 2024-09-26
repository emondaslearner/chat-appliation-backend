const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    userId: {
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

const notificationModel = model("notification", notificationSchema);

module.exports = notificationModel;
