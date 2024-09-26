const express = require("express");
const authenticate = require("@middleware/authenticate");

// routers
const authRoutes = require("./auth");
const userRoutes = require("./user");
const friendRoutes = require("./friend");
const friendRequestRoutes = require("./friendRequest");
const postRoutes = require("./post");
const notificationRoutes = require("./notification");
const commentRoutes = require("./comment");
const messageRoutes = require("./message");
const chatsRoutes = require("./chats");
const photoRoutes = require("./photo");
const videoRoutes = require("./video");

const router = express.Router();

// auth
authRoutes(router);

// user
userRoutes(router, authenticate);

// friend
friendRoutes(router, authenticate);

// friend-request
friendRequestRoutes(router, authenticate);

// posts
postRoutes(router, authenticate);

// notification
notificationRoutes(router, authenticate);

// comment
commentRoutes(router, authenticate);

// message
messageRoutes(router, authenticate);

// chats
chatsRoutes(router, authenticate);

// photos
photoRoutes(router, authenticate);

// videos
videoRoutes(router, authenticate);

module.exports = router;
