const { error } = require("@utils");
const User = require("@models/User");
const { uploadPhotoToCloudinary } = require("@third-party/cloudinary");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const updateUser = async ({ id, data }) => {
  if (!id) {
    throw error.badRequest("id is required");
  }

  const keys = Object.keys(data);

  if (!keys.length) {
    throw error.badRequest("Please provide at latest one value");
  }

  const user = await User.findById(id);
  if (!user) {
    throw error.notFound();
  }

  // upload profile picture to cloudinary
  if (data.profile_picture) {
    const fileUploadedData = await uploadPhotoToCloudinary({
      imagePath: `./src/uploads/${data.profile_picture.filename}`,
      folderName: "users",
      unique_filename: true,
      use_filename: false,
      overwrite: false,
    });

    data.profile_picture = fileUploadedData.secure_url;
  }

  // upload cover picture to cloudinary
  if (data.cover_picture) {
    const fileUploadedData = await uploadPhotoToCloudinary({
      imagePath: `./src/uploads/${data.cover_picture.filename}`,
      folderName: "users",
      unique_filename: true,
      use_filename: false,
      overwrite: false,
    });

    data.cover_picture = fileUploadedData.secure_url;
  }

  const newData = user._doc ? user._doc : user;

  const userProperties = { ...User.schema.paths, city: "", country: "" };

  // delete unnecessary properties
  delete userProperties._id;
  delete userProperties.__v;
  delete userProperties.updatedAt;
  delete userProperties.createdAt;
  delete userProperties.verified;
  delete userProperties.address;
  delete userProperties.password;

  // check if data properties exist in userProperties then update in db
  for (const key in data) {
    if (key in userProperties && data[key]) {
      if (key === "city" || key === "country") {
        newData.address = {
          ...newData?.address,
          [key]: data[key],
        };
      } else {
        newData[key] = data[key];
      }
    }
  }

  //delete mongoose itself properties
  delete newData._id;
  delete newData.__v;
  delete newData.updatedAt;
  delete newData.createdAt;

  const updatedData = await User.findOneAndUpdate({ _id: id }, newData, {
    new: true,
  })
    .select("-password")
    .exec();

  if (data?.status) {
    global.io.to(id).emit("userStatus", {
      id,
      status: data.status,
    });
  }

  deleteKeysWithPrefix("friend:");
  deleteKeysWithPrefix("users:");
  deleteKeysWithPrefix("chats:");

  return updatedData;
};

module.exports = updateUser;
