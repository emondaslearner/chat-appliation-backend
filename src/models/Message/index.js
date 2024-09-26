const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    sent_to: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
    },
    file: {
      type: [String],
    },
    sent_by: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    replied: {
      type: Schema.ObjectId,
      ref: "message",
    },
    deleted_for: {
      type: Schema.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["not_delivered", "delivered", "seen"],
      default: "not_delivered",
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

const messageModel = model("message", messageSchema);

module.exports = messageModel;
