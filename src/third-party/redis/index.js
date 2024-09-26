const { getClient } = require("@db/connectRedis");

const client = getClient();

const addDataInRedis = async ({ key, value, expire }) => {
  const result = await client.set(key, value, { EX: expire || 1300 });

  return result ? true : false;
};

const getDataFromRedis = async (key, query, expire) => {
  let value = await client.get(key);

  if (!value) {
    console.log(`cache miss ${key}`);
    const data = await query();

    value = JSON.stringify(data);
    addDataInRedis({ key, value, expire });
  } else {
    console.log(`cache hit ${key}`);
  }

  return JSON.parse(value);
};

const deleteKeysWithPrefix = async (prefix) => {
  try {
    const keys = await client.keys(`${prefix}*`);
    const pipeline = client.multi();

    keys.forEach((key) => pipeline.del(key));

    await pipeline.exec();

    console.log("All keys starting with 'friend:' deleted successfully!");
  } catch (error) {
    console.error("Error deleting keys:", error);
  }
};

module.exports = {
  getDataFromRedis,
  addDataInRedis,
  deleteKeysWithPrefix,
};
