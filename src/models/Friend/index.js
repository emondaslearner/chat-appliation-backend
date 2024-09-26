const { Schema, model } = require("mongoose");

const friendSchema = new Schema(
  {
    first_user: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    blocked_by: {
      type: Schema.ObjectId,
      ref: "user",
    },
    second_user: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    chat_deleted_for: {
      type: [String],
    },
    unread_message_count: {
      type: Number,
      default: 0,
    },
    last_message: {
      type: String,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

friendSchema.index({ second_user: 1, first_user: 1 });

const friendModel = model("friend", friendSchema);

module.exports = friendModel;
