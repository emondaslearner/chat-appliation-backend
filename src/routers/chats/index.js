const { getAllChats, deleteChat, editChat } = require("@controller/v1/chats");

const chatsRoutes = (router, authenticate) => {
  router.get("/user/chats", authenticate, getAllChats);
  router.delete("/user/:id/chat", authenticate, deleteChat);
  router.patch("/user/:id/chat", authenticate, editChat);
};

module.exports = chatsRoutes;
