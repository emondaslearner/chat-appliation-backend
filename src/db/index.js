const connectDb = require("./connectDb");
const connectRedis = require("./connectRedis");

module.exports = { connectDb, connectRedis: connectRedis.connection };
