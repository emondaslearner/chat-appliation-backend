const { parentPort } = require("worker_threads");
const { addPost } = require("./uploadFile/addPostFileHandler");
const { updatePost } = require("./uploadFile/updatePostFileHandler");
const { connectDb } = require("../db");
const { sentMessageToTopic } = require("../third-party/firebase");
const addMessageFiles = require("./uploadFile/addMessageFile");
const Post = require("../models/Post");

(async () => {
  await connectDb("worker");
})();

parentPort.on("message", async (allData) => {
  if (allData.status === "addPost") {
    try {
      const data = JSON.parse(allData.data);
      const savedData = await addPost(data);
      const postData = await Post.findById(savedData?._id).populate(
        "photos",
        "photo"
      );
      if (savedData) {
        await sentMessageToTopic({
          topic: data.userId,
          title: "Post added",
          body: `"Post uploaded successfully"`,
        });

        parentPort.postMessage({
          userId: data.userId,
          savedData: JSON.stringify(postData),
          status: "addPostData",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (allData.status === "updatePost") {
    try {
      const data = JSON.parse(allData.data);
      const savedData = await updatePost(data);
      const postData = await Post.findById(savedData?._id).populate(
        "photos",
        "photo"
      );
      if (savedData) {
        await sentMessageToTopic({
          topic: data.userId,
          title: "Post status updated",
          body: `"Post updated successfully"`,
        });

        parentPort.postMessage({
          userId: data.userId,
          savedData: JSON.stringify(postData),
          status: "updatePostData",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (allData.status === "uploadFileOnMessage") {
    try {
      const data = JSON.parse(allData.data);
      await addMessageFiles(data);
    } catch (err) {
      console.log(err);
    }
  }
});
