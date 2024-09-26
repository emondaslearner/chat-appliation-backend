const { Schema, model } = require("mongoose");

const Address = new Schema({
  city: {
    type: String,
  },
  country: {
    type: String,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: String,
    },
    cover_picture: {
      type: String,
    },
    bio: {
      type: String,
      maxLength: 100,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    address: Address,
    locked: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    id: true,
  }
);

userSchema.index({ email: 1, name: 1 });

const User = model("user", userSchema);

module.exports = User;
