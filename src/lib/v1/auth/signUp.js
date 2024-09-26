const { createUser } = require("@lib/v1/user");
const { error } = require("@utils");
const { generateToken } = require("@third-party/token");

const signUp = async (data) => {
  // create user
  const savedData = await createUser(data);

  // if user not create then throw error
  if (!savedData) throw error.serverError();

  //generate access token
  const accessToken = await generateToken({
    data: {
      id: savedData._id,
    },
    expireAt: process.env.ACCESS_EXPIRE_TIME,
  });

  //generate refresh token
  const refreshToken = await generateToken({
    data: {
      id: savedData._id,
    },
  });

  // combine both token
  const token = `Bearer ${accessToken} ${refreshToken}`;

  return { token, savedData };
};

module.exports = signUp;
