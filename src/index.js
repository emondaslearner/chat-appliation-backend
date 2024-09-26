require("module-alias/register");
require("dotenv").config();
const app = require("./app");
const http = require("http");
const { connectDb, connectRedis } = require("./db");
const socketConnection = require("./third-party/socket.io");

const port = 6500 || process.env.PORT;
const server = http.createServer(app);

const main = async () => {
  try {
    await connectRedis();
    await connectDb();

    // socket connection
    await socketConnection(server);

    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

main();
