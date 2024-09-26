const { error } = require("@utils");
const path = require("path");
const { Worker } = require("worker_threads");
const { deleteKeysWithPrefix } = require("@third-party/redis");

const worker_threads = new Worker(
  path.join(__dirname, "../../../", "worker", "index.js")
);

const addPost = async ({ title, color, photo, video, userId }) => {
  if (color && !title) {
    throw error.badRequest(
      "title:When you provide color then you must have to pass title"
    );
  }

  if (color && title && photo.length) {
    throw error.badRequest(
      "photo:When you provide color then you can not pass photo"
    );
  }

  if (color && title && video.length) {
    throw error.badRequest(
      "photo:When you provide color then you can not pass video"
    );
  }

  if (video.length + photo.length > 4) {
    throw error.badRequest(
      "photo&video:You can upload a maximum of 4 videos and photos."
    );
  }

  const data = {
    title,
    color,
    photo,
    video,
    userId,
  };

  worker_threads.postMessage({
    status: "addPost",
    data: JSON.stringify(data),
  });

  return true;
};

// send update to user via socket
worker_threads.on("message", (message) => {
  if (message.userId && message.status === "addPost") {
    deleteKeysWithPrefix("posts:");
    deleteKeysWithPrefix("photos:");
    deleteKeysWithPrefix("videos:");
    global.io.to(message.userId).emit("postUploaded", message);
  }

  if (message.userId && message.status === "addPostData") {
    console.log("message.savedData", message.savedData);
    global.io.to(message.userId).emit("postAdded", message.savedData);
  }
});

module.exports = addPost;
