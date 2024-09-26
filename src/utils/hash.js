const bcrypt = require("bcryptjs");
const { badRequest } = require("./error");

const generateHash = async (value) => {
  if (!value) {
    throw badRequest("Hash value is empty");
  }

  const hashedValue = await bcrypt.hash(value, 10);

  return hashedValue;
};

const verifyHash = async (value, hashedValue) => {
  if (!value || !hashedValue) {
    throw error.badRequest(
      "value and hashedValue not provided in verifyHash function"
    );
  }

  const isCorrect = await bcrypt.compare(value, hashedValue);

  return isCorrect;
};

module.exports = { generateHash, verifyHash };
