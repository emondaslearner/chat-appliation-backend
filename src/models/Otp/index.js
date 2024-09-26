const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expireAt: {
      type: Date,
      expires: "10m",
      default: Date.now,
    },
  },
  {
    timestamps: true,
    id: true,
  }
);

otpSchema.index({ userId: 1 });

const Otp = model("Otp", otpSchema);

module.exports = Otp;
