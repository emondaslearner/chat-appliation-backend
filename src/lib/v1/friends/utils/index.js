const { getClient } = require("@db/connectRedis");
const client = getClient();

const { addDataInRedis } = require("@third-party/redis");

const addFriendToRedisCache = async (userId, friendId) => {
  const key = `userFriends:${userId}`;

  let value = await client.get(key);

  if (value) {
    const data = JSON.parse(value);

    data.push(friendId);

    addDataInRedis(key, data, 86400);
  }
};

const deleteFriendFromRedisCache = async (userId, friendId) => {
  const key = `userFriends:${userId}`;

  let value = await client.get(key);

  if (value) {
    const data = JSON.parse(value);

    const newArray = data.filter((data) => data !== friendId);

    addDataInRedis(key, newArray, 86400);
  }
};

module.exports = { addFriendToRedisCache, deleteFriendFromRedisCache };
