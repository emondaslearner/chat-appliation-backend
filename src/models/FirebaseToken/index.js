const { Schema, model } = require("mongoose");

const tokenSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

tokenSchema.index({ user_id: 1 });

const tokenModel = model("firebase_token", tokenSchema);

module.exports = tokenModel;
